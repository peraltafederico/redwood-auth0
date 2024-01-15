import type { Prisma, User } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.UserCreateArgs>({
  user: {
    one: {
      data: { email: 'String6430980', updateTime: '2024-01-11T19:03:45.387Z' },
    },
    two: {
      data: { email: 'String8501917', updateTime: '2024-01-11T19:03:45.387Z' },
    },
  },
})

export type StandardScenario = ScenarioData<User, 'user'>
