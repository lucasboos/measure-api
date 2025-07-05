import { FastifyRequest, FastifyReply } from 'fastify';
import { confirmMeasure, registerMeasure } from '../services/measure.service';
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

const measureConfirmSchema = z.object({
  measure_uuid: z.string().uuid({ message: 'Invalid UUID format.' }),
  confirmed_value: z.number()
    .positive({ message: 'Confirmed value must be greater than zero.' })
    .refine(val => Number.isFinite(val), { message: 'Confirmed value must be a valid number.' }),
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

export const confirm = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const parsed = measureConfirmSchema.safeParse(req.body);

    if (!parsed.success) {
      const error = parsed.error.errors[0];
      return reply.status(400).send({
        error_code: 'INVALID_DATA',
        message: error.message,
      });
    }

    await confirmMeasure(parsed.data);

    return reply.status(200).send({
      success: true,
    });
  } catch (err: any) {
    return reply.status(err.status || 500).send({
      error_code: err.error_code || 'INTERNAL_ERROR',
      message: err.message || 'Internal error when recording measurement.',
    });
  }
}