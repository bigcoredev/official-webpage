'use client'

import { DataTable } from '@/components/DataTable'
import LocalTime from '@/components/Localtime'
import type { UserListItem } from '@/lib/types/user'
import type { ColumnDef } from '@tanstack/react-table'

export default function UserListTable({ users }: { users: UserListItem[] }) {
  const columns: ColumnDef<UserListItem>[] = [
    {
      accessorKey: 'username',
      header: '아이디'
    },
    {
      accessorKey: 'email',
      header: '이메일'
    },
    {
      accessorKey: 'nickname',
      header: '닉네임'
    },
    {
      accessorKey: 'role',
      header: '권한'
    },
    {
      accessorKey: 'status',
      header: '계정상태'
    },
    {
      accessorKey: 'lastLogin',
      header: '마지막 로그인',
      cell: ({ row }) => {
        return (
          <LocalTime
            utc={row.getValue('lastLogin')}
            format="YYYY-MM-DD ddd HH:mm:ss"
          />
        )
      }
    }
  ]

  return <DataTable columns={columns} data={users} />
}
