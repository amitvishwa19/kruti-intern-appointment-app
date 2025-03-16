import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { SignJWT, jwtVerify } from "jose";
import { MemberRole } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid'
import { headers } from "next/headers";
import { decrypt } from "@/lib/auth";
import { orderBy } from "lodash";
import { data } from "autoprefixer";
import moment from "moment";


export async function GET(req) {
    try {

        const headersList = headers()
        const accessToken = headersList.get('Authorization')
        console.log(accessToken)


        const { userId } = await decrypt(accessToken)

        //const decrypttoken = await decrypt(accessToken)

        //console.log('Getting all appointment', decrypttoken)
        console.log('userId', userId)

        const user = await db.user.findUnique({ where: { id: userId } })
        if (!user) return NextResponse.json({ status: 401, message: 'Unauthorized access' })

        const appointments = await db.appointment.findMany({
            where: { patientId: userId },
            include: {
                doctor: true
            },
            orderBy: {
                updatedAt: 'desc',
            },
        })


        return NextResponse.json({ status: 200, appointments: appointments })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ status: 500, message: 'Internal server error' })
    }
}

export async function POST(req) {

    try {
        let user
        let appointment

        const headersList = headers()
        const accessToken = headersList.get('Authorization')
        const payload = await req.json();
        const { date, slot, time, note, type, selectedDoctor, patient } = payload.data
        console.log('payload', payload.data)

        const { userId } = await decrypt(accessToken)
        user = await db.user.findUnique({ where: { id: userId } })

        console.log(userId)

        if (!user) return NextResponse.json({ status: 401, message: 'Unauthorized access' })

        // await db.user.update({
        //     where: { id: userId },
        //     data: {
        //         address: payload,
        //     }
        // })
        //console.log('new date', moment)

        appointment = await db.appointment.create({
            data: {
                patientId: patient,
                doctorId: selectedDoctor,
                date: new Date(date.date),
                slot: slot.slot,
                note,
                time: time.time,
                type,
                status: 'PENDING'
            }
        })

        //console.log('appointment', appointment)

        const appointments = await db.appointment.findMany({
            where: { patientId: user.id },
            include: {
                doctor: true
            },
            orderBy: {
                updatedAt: 'desc',
            },
        })

        //console.log('appointments', appointments)
        return NextResponse.json({ status: 200, appointment: appointment, 'appointments': appointments })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ status: 500, message: 'Internal server Error' })
    }
}