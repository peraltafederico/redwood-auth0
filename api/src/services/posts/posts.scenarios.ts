import type { Prisma, Post } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.PostCreateArgs>({
  post: {
    one: {
      data: {
        title: 'String',
        body: 'String',
        updatedAt: '2024-01-11T19:02:27.057Z',
        author: {
          create: {
            email: 'String7943926',
            updateTime: '2024-01-11T19:02:27.057Z',
          },
        },
      },
    },
    two: {
      data: {
        title: 'String',
        body: 'String',
        updatedAt: '2024-01-11T19:02:27.057Z',
        author: {
          create: {
            email: 'String795346',
            updateTime: '2024-01-11T19:02:27.057Z',
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Post, 'post'>
