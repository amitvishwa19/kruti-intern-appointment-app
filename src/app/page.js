'use client'
import Image from "next/image";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import { useEffect, useState } from "react";
import { format, addMinutes, startOfDay } from 'date-fns';
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { db } from "@/lib/db";



const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
]

export default function Home() {
  const [appointment, setAppointment] = useState([])
  const [slot, setSlot] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [data, setData] = useState({ slot: '', name: '', description: '' })
  const [open, setOpen] = useState(false)

  useEffect(() => {
    createSlot()
  }, [])


  const createSlot = (interval = 30) => {
    const timeSlots = [];
    let currentTime = startOfDay(new Date());


    for (let i = 0; i < (24 * 60) / interval; i++) {
      timeSlots.push(format(currentTime, 'HH:mm a'));
      currentTime = addMinutes(currentTime, interval);
    }

    setSlot(timeSlots)
    //console.log(timeSlots)
  }

  const handleSlectedSlot = (slot) => {
    setSelectedSlot(slot)
    setData({ ...data, slot })
    //console.log(slot)
  }

  const handleOpenChange = () => {
    console.log('openchange')
    setSelectedSlot(null)
    //setSlot(null)
    setData({ slot: '', name: '', description: '' })
  }

  const handleEdit = (appointment) => {
    toast.success('Edit appointment', appointment)
    setOpen(true)
  }

  const handleDelete = (slot) => {
    //toast.error('Delete appointment')
    const newAppointment = appointment.filter((appointment) => appointment.slot !== slot)
    setAppointment(newAppointment)

    console.log(slot)
  }

  const handleCancel = () => {
    setOpen(false)
    setData({ slot: '', name: '', description: '' })
  }

  const handleFomSubmit = async () => {
    //toast.success`Appointment created successfully`
    if (data.slot === '') return toast.error('Please select slot')
    if (data.name === '') return toast.error('Please enter name')
    if (data.description === '') return toast.error('Please enter description')

    const slot = appointment.filter((appointment) => appointment.slot === data.slot)

    if (slot.length > 0) return toast.error('Appointment already exist in this slot')

    console.log('slot', slot)

    // const res = await db.appointment.create({
    //   data: {
    //     slot: data.slot,
    //     name: data.name,
    //     description: data.description
    //   }
    // })

    setAppointment([...appointment, data])
    setOpen(false)
  }

  return (
    <div className="flex min-h-screen bg-slate-800 text-white w-full p-4">

      <div className=" text-center  flex flex-col w-full">
        <div>
          <h1 className="text-3xl font-bold  text-center">
            Appointment booking app
          </h1>

          {/* <div className=" justify-end w-full">
            <Button variant="outline" className='text-slate-800'>Add Appointment</Button>
          </div> */}
        </div>

        <div className="flex justify-end">
          <AlertDialog open={open} onOpenChange={handleOpenChange}>
            <AlertDialogTrigger asChild>
              <Button variant="outline" onClick={() => { setOpen(!open) }} className='text-slate-800'>Add Appointment</Button>
            </AlertDialogTrigger>

            <AlertDialogContent className='sm:max-w-[825px]'>
              <AlertDialogHeader>
                <AlertDialogTitle>Create new Appointment</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your
                  account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <div className="flex flex-col gap-4">
                <div className="flex flex-row flex-wrap gap-2">
                  {
                    slot?.map((time, index) => {
                      return (
                        <div key={index} onClick={() => { handleSlectedSlot(time) }}>
                          <Button variant='outline' className={`bg-gray-200 ${selectedSlot === time ? 'bg-sky-400 hover:bg-sky-600' : ''}`}>{time}</Button>
                        </div>
                      )
                    })
                  }
                </div>

                <div className="flex flex-col gap-4">

                  <Input value={data.name} type="text" placeholder="Name" onChange={(e) => { setData({ ...data, name: e.target.value }) }} />
                  <Textarea value={data.description} rows='6' placeholder="Description" onChange={(e) => { setData({ ...data, description: e.target.value }) }} />


                </div>
              </div>




              <AlertDialogFooter>
                {/* <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => { handleFomSubmit() }}>Submit</AlertDialogAction> */}
                <Button onClick={() => { handleCancel() }}>Cancel</Button>
                <Button onClick={() => { handleFomSubmit() }}>Submit</Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className="p-10">
          <Table>
            <TableCaption>A list of your appointment</TableCaption>
            <TableHeader>
              <TableRow className='text-center'>
                <TableHead className="w-[20%]" >Slot</TableHead>
                <TableHead className="w-[20%]">Name</TableHead>
                <TableHead className="w-[60%]">Description</TableHead>
                <TableHead className="w-[60%]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointment.map((appointment, index) => (
                <TableRow key={index}>
                  <TableCell className="text-xl">{appointment.slot}</TableCell>
                  <TableCell className='text-xl'>{appointment.name}</TableCell>
                  <TableCell className='text-xl'>{appointment.description}</TableCell>
                  <TableCell className='text-xl'>
                    <div className="flex justify-center gap-2">
                      <Button variant='outline' size='sm' className='text-slate-800' onClick={() => { handleEdit(appointment) }}>Edit</Button>
                      <Button variant='outline' size='sm' className='text-slate-800' onClick={() => { handleDelete(appointment.slot) }}>Delete</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

          </Table>
        </div>
        <div>

        </div>
      </div>
    </div >
  );
}
