import { DataTable } from "@/components/data-table";
import { columns, type Payment } from "./columns"


const Books = () => {
    const data : Payment[] = [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
  ]


    return ( <div>
        <DataTable columns={columns} data={data} />
    </div> );
}
 
export default Books;