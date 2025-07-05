import { FastifyRequest, FastifyReply } from 'fastify';
import { registerMeasure } from '../services/measure.service';
import { MeasureType } from '../types/measure';
import { z } from 'zod';

const measureSchema = z.object({
  image: z
    .string()
    .refine(val => /^data:image\/(png|jpeg|jpg);base64,/.test(val), {
      message: 'Invalid image shape.'
    }),
  customer_code: z.string().min(1, { message: 'Customer code required.' }),
  measure_datetime: z.coerce.date({ errorMap: () => ({ message: 'Invalid date.' }) }),
  measure_type: z.enum([MeasureType.WATER, MeasureType.ELECTRICITY], {
    errorMap: () => ({ message: 'Type of measurement must be WATER or ELECTRICITY.' })
  }),
});

export const upload = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const parsed = measureSchema.safeParse(req.body);

    if (!parsed.success) {
      const error = parsed.error.errors[0];
      return reply.status(400).send({
        error_code: 'INVALID_DATA',
        message: error.message,
      });
    }

    const measure = await registerMeasure(parsed.data);

    return reply.status(200).send({
      image_url: measure.image_url,
      measure_value: measure.measure_value,
      measure_uuid: measure.id,
    });
  } catch (err: any) {
    return reply.status(err.status || 500).send({
      error_code: err.error_code || 'INTERNAL_ERROR',
      message: err.message || 'Internal error when recording measurement.',
    });
  }
};