import { AppDataSource } from '../config/database';
import { Measure } from '../entities/Measure';
import { IMeasurePayload, IMeasureConfirmPayload, IMeasureFilter } from '../types/measure';

const measureRepository = AppDataSource.getRepository(Measure);

export const registerMeasure = async (measure: IMeasurePayload) => {
  const { customer_code, measure_datetime } = measure;

  const existingMeasure = await measureRepository
    .createQueryBuilder('m')
    .where('m.customer_code = :customer_code', { customer_code })
    .andWhere(
      "DATE_TRUNC('month', m.measure_datetime) = DATE_TRUNC('month', CAST(:measure_datetime AS TIMESTAMP))",
      { measure_datetime }
    )
    .getOne();

  if (existingMeasure) throw {
    status: 409,
    error_code: 'DOUBLE_REPORT',
    message: 'Monthly measurement already taken.'
  };

  // Mock
  const measure_value = Math.floor(Math.random() * 1000);

  const newMeasure = measureRepository.create({
    ...measure,
    measure_value,
    image_url: 'https://fake-bucket.com/image/' + crypto.randomUUID(),
  });

  await measureRepository.save(newMeasure);

  return {
    id: newMeasure.id,
    image_url: newMeasure.image_url,
    measure_value: newMeasure.measure_value,
  };
}

export const confirmMeasure = async (measure: IMeasureConfirmPayload) => {
  const { measure_uuid, confirmed_value } = measure;

  const existingMeasure = await measureRepository.findOneBy({ id: measure_uuid });
  if (!existingMeasure) throw {
    status: 404,
    error_code: 'MEASURE_NOT_FOUND',
    message: 'Measurement not found.'
  };

  const { has_confirmed, measure_value } = existingMeasure as any;
  if (has_confirmed) throw {
    status: 409,
    error_code: 'CONFIRMATION_DUPLICATE',
    message: 'This measurement has already been confirmed.'
  };

  const shouldUpdate = measure_value !== confirmed_value;

  await measureRepository.update(
    { id: measure_uuid },
    {
      has_confirmed: true,
      ...(shouldUpdate && { measure_value: confirmed_value }),
    }
  );
}

export const getMeasuresByCustomer = async (filter: IMeasureFilter) => {
  const { customer_code, measure_type } = filter;

  const query = measureRepository
    .createQueryBuilder('m')
    .select([
      'm.id',
      'm.measure_datetime',
      'm.measure_type',
      'm.has_confirmed',
      'm.image_url',
    ])
    .where('LOWER(m.customer_code) = LOWER(:customer_code)', { customer_code });

  if (measure_type) {
    query.andWhere('m.measure_type = :measure_type', { measure_type });
  }

  const measures = await query.getMany();

  if (measures.length === 0) throw {
    status: 404,
    error_code: 'MEASURES_NOT_FOUND',
    message: 'Measurements not found.'
  };

  return {
    customer_code,
    measures: measures,
  };
};