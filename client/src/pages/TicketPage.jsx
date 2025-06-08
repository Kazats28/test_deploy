import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTicket } from "../api-helpers/api-helpers";
import Ticket from "../components/common/Ticket";
import { setGlobalLoading } from "../redux/features/globalLoadingSlice.js";
import { Box } from '@mui/material';;
import { useDispatch } from "react-redux";

const TicketPage = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const [booking, setBooking] = useState(null);

    useEffect(() => {
        const fetchBooking = async () => {
        try {
            const res = await getTicket(id); // hoặc tạo API `getBookingById` theo ID booking
            setBooking(res.booking);
        } catch (err) {
            console.error(err);
        }
        };
        dispatch(setGlobalLoading(true));
        fetchBooking();
        dispatch(setGlobalLoading(false));
    }, [id]);

    return (
        <Box
        mt={4}
        sx={{
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        }}
        >
        {booking && (
            <Ticket booking={booking} title={booking.movie.title} />
        )}
        </Box>

    );
};

export default TicketPage;
