import { z } from 'zod';

const stringExpectationSchema = z.object({
  value: z.string(),
  comparison: z.enum(['exact', 'trimmed', 'normalized-lines']).optional(),
}).strict();

const judgeCaseExpectationsSchema = z.object({
  output: stringExpectationSchema.optional(),
  returnValue: stringExpectationSchema.optional(),
  error: stringExpectationSchema.optional(),
}).strict().refine(
  (expectation) => expectation.output !== undefined
    || expectation.returnValue !== undefined
    || expectation.error !== undefined,
  'expect には output / returnValue / error のいずれかが必要です'
);

const judgeCaseSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  visibility: z.enum(['visible', 'hidden']),
  run: z.object({
    code: z.string(),
  }).strict(),
  expect: judgeCaseExpectationsSchema,
}).strict();

const baseJudgeSchema = z.object({
  passRule: z.literal('all').optional(),
  timeoutMs: z.number().int().positive().optional(),
});

const programJudgeSchema = baseJudgeSchema.extend({
  kind: z.literal('program'),
  cases: z.array(judgeCaseSchema).min(1),
}).strict();

const functionJudgeSchema = baseJudgeSchema.extend({
  kind: z.literal('function'),
  functionName: z.string().min(1),
  cases: z.array(judgeCaseSchema).min(1),
}).strict();

export const judgeSpecSchema = z.discriminatedUnion('kind', [programJudgeSchema, functionJudgeSchema]);

export const problemMarkdownFrontmatterSchema = z.object({
  id: z.string().min(1).regex(/^[a-z0-9-]+$/, 'id は小文字英数とハイフンで指定してください'),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, 'slug は小文字英数とハイフンで指定してください'),
  title: z.string().min(1),
  category: z.string().min(1),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  estimatedMinutes: z.number().int().positive().optional(),
  learningGoals: z.array(z.string().min(1)).min(1),
  hint: z.string().min(1).optional(),
  draft: z.boolean().optional().default(false),
}).strict();

export const problemManifestSchema = z.object({
  version: z.literal(1),
  problemOrder: z.array(z.string().min(1)).superRefine((problemOrder, context) => {
    const seenProblemIds = new Set<string>();

    problemOrder.forEach((problemId, index) => {
      if (seenProblemIds.has(problemId)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: `problemOrder に重複した ID があります: ${problemId}`,
          path: [index],
        });
        return;
      }

      seenProblemIds.add(problemId);
    });
  }),
}).strict();

export type ProblemManifest = z.infer<typeof problemManifestSchema>;
export type ProblemMarkdownFrontmatter = z.infer<typeof problemMarkdownFrontmatterSchema>;