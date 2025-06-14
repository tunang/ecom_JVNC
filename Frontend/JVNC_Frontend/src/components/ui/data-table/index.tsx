/* eslint-disable @typescript-eslint/no-explicit-any */
import { type ColumnDef } from '@tanstack/react-table';
import { DataTableToolbar } from '@/components/ui/data-table/data-table-toolbar';
import { DataTable } from '@/components/ui/data-table/data-table';

interface TablePageProps<T> {
  title: string;
  data: T[];
  columns: ColumnDef<T>[];
  loading?: boolean;
  children?: React.ReactNode;
  Modal?: React.ComponentType<any>;
  modalProps?: { mode: 'create' | 'edit' | 'read'; onSubmit: (data: any) => void };
  hasToolbar?: boolean;
  hasPagination?: boolean;
}

export default function TablePage<T>({
  title,
  data,
  columns,
  loading,
  children,
  Modal,
  modalProps,
  hasToolbar = true,
  hasPagination = true,
}: TablePageProps<T>) {
  return (
    <div className="rounded-sm bg-white p-4">
      {title && (
        <>
          <h2 className="mb-4 text-2xl font-bold tracking-tight">{title}</h2>
          <hr />
        </>
      )}
      <DataTable
        data={data}
        columns={columns}
        toolbar={
          hasToolbar ? (table) => <DataTableToolbar table={table} Modal={Modal} modalProps={modalProps} /> : undefined
        }
        loading={loading}
        hasPagination={hasPagination}
        children={children}
      />
    </div>
  );
}
