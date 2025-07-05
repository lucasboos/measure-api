import { AppDataSource } from '../config/database';
import { Measure } from '../entities/Measure';
import { IMeasurePayload } from '../types/measure';

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