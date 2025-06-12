import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import { Grid, Modal, Rating } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Chip, Divider, Stack, Typography } from "@mui/material";
import React,{Fragment, useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation  } from "react-router-dom";
import { toast } from "react-toastify";
import CircularRate from "../components/common/CircularRate.jsx";
import Container from "../components/common/Container.jsx";
import ImageHeader from "../components/common/ImageHeader.jsx";
import MediaSlide from "../components/common/MediaSlide.jsx";
import QrCodeIcon from '@mui/icons-material/QrCode';
import uiConfigs from "../configs/ui.configs.js";
import { BrowserProvider } from "ethers";

import { setGlobalLoading } from "../redux/features/globalLoadingSlice.js";
import { setAuthModalOpen } from "../redux/features/authModalSlice.js";

import CastSlide from "../components/common/CastSlide.jsx";
import MediaVideos from "../components/common/MediaVideos.jsx";
import BackdropSlide from "../components/common/BackdropSlide.jsx";
import { getAllMovies, getUserBooking } from "../api-helpers/api-helpers";
import { getBookings, getMovieDetails, newBooking, getUserFavorite, newFavorite, deleteFavorite, addRate, updateRate, getUserRating, updateAverageRating} from "../api-helpers/api-helpers.js";
import dayjs from "dayjs";
import axios from 'axios';
import { BACKEND_URL } from "../configs/config.js";
import userApi from "../api/modules/user.api.js";
import Ticket from "../components/common/Ticket.jsx";
const MediaDetail = () => {
  const backEndUrl = BACKEND_URL;
  const amount = 10000;
  const id = useParams().id;
  const [movie, setMovie] = useState();
  const dispatch = useDispatch();
  const [inputs, setInputs] = useState({ 
    seatNumber: localStorage.getItem('seatNumber') || "", 
    date: localStorage.getItem('date') || "", 
    hour: localStorage.getItem('hour') || "" });
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedDay, setSelectedDay] = useState([]);
  const [listDay, setListDay] = useState([]);
  const [listTime, setListTime] = useState([]);
  const [selectedTime, setSelectedTime] = useState([]);
  const [bookings, setBookings] = useState();
  const [seatBooking, setSeatBooking] = useState(Array(selectedSeats.length).fill(false));
  let seatTemp;
  const [onRequest, setOnRequest] = useState(false);
  const { admin } = useSelector((state) => state.admin);
  const { user} = useSelector((state) => state.user);
  const [listFavorites, setListFavorites] = useState([]);
  const [listRates, setListRates] = useState([]);
  const bookingsRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState(0);
  const [isRateRequest, setIsRateRequest] = useState(false);
  const [in4, setIn4] = useState("");
  const location = useLocation();
  const [params, setParams] = useState(null);
  const [isRequest, setIsRequest] = useState(false);
  const [isAppear, setIsAppear] = useState(false);
  const [method, setMethod] = useState(localStorage.getItem('method') || 0);
  const [isPayment, setIsPayment] = useState(false);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [movies, setMovies] = useState([]);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchVnpayReturn = () => {
      const params = new URLSearchParams(location.search);
      setParams(params);
    };
    fetchVnpayReturn();
  }, [location]);
  useEffect(() => {
    const fetchUser = async () => {
      const { response, err } = await userApi.getInfo();
      if (response) setUserInfo(response);
    };
    fetchUser();
  }, [user]);
  const handleChange = async (event, newValue) => {
    setValue(newValue);
    if(user){
      if(isRateRequest) return;
      if(bookings.some(e => e.user == localStorage.getItem("userId"))){
        if(listRates.some(e => e.movie.id == id)){
          setIsRateRequest(true);
          const temp = listRates.find(e => e.movie.id == id);
          await updateRate({rateId: temp.id, rate: newValue})
            .then((res) => console.log(res))
            .catch((err) => console.log(err));
            setIsRateRequest(false);
          }
          else{
            setIsRateRequest(true);
            await addRate({rate: newValue, movie: movie.id})
            .then((res) => console.log(res))
            .catch((err) => console.log(err));
            getListRate();
            setIsRateRequest(false);
        }
      }
      await updateAverageRating(id)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
    }
  };
  const handleOpen = () => {
    if(!inputs.seatNumber)
      {
        toast.error("Chưa chọn vị trí ngồi!");
      return;
    }
    setIsAppear(true);
  };
  const handleClose = () => {
    setIsOpen(false);
    setIsAppear(false);
  };
  const getNextNDays = () => {
    const today = new Date();
    const result = [];
    
    for (let i = 0; i < 7; i++) {
      let nextDate = new Date(today);
      nextDate.setDate(today.getDate() + i);
      
      if (nextDate.getDate() < today.getDate() + i) {
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
        const daysToAdd = today.getDate() + i - lastDayOfMonth;
        nextDate = new Date(today.getFullYear(), today.getMonth() + 1, daysToAdd);
      }
  
      result.push(nextDate);
    }
  
    setListDay(result);
  };
  const getListBooking = async () => {
    await getBookings(id)
    .then((res) => setBookings(res.booking))
    .catch((err) => console.log(err));
  };
  const getListRate = async () => {
    await getUserRating()
    .then((res) => {
      setListRates(res.rates);
      const rate = res.rates.find(e => e.movie.id == id);
      if(rate) setValue(rate.rate);
    })
    .catch((err) => console.log(err));
  };
  const getRecommendedMovies = async () => {
    try {
      const [allMoviesRes, bookingRes, favoriteRes] = await Promise.all([
        getAllMovies(),
        getUserBooking(),
        getUserFavorite()
      ]);
      const allMovies = allMoviesRes?.movies || [];
      const bookedMovies = bookingRes?.bookings?.map(b => b.movie) || [];
      const favoriteMovies = favoriteRes?.favorites?.map(f => f.movie) || [];
      const relatedGenres = [
        ...new Set([
          ...bookedMovies.flatMap(m => m.genres || []),
          ...favoriteMovies.flatMap(m => m.genres || [])
        ])
      ];
      // Loại trừ phim hiện tại và lọc phim cùng thể loại
      const recommend = allMovies.filter(
        m => m.id !== id && m.genres?.some(g => relatedGenres.includes(g))
      );
      if (recommend.length < 8) {
        const remainingMovies = allMovies.filter(movie => !recommend.includes(movie));
        recommend.push(...remainingMovies);
      }
      setRecommendedMovies(recommend.slice(0, 8));
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (user && movie) getRecommendedMovies();
  }, [user, movie]);
  useEffect(() => {
    const getInformation = async () => {
      dispatch(setGlobalLoading(true));
      await updateAverageRating(id)
      .then((res) => {console.log(res)})
      .catch((err) => {console.log(err)});
      dispatch(setGlobalLoading(false));
    };
    getInformation();
  }, []);
  useEffect(() => {
      const getMovies = async () => {
        await getAllMovies()
          .then((data) => {setMovies(data.movies);})
          .catch((err) => console.log(err));
        dispatch(setGlobalLoading(false));
      };
      getMovies();
    }, []);
  useEffect(() => {
    const getInformation = async () => {
      window.scrollTo(0, 0);
      getNextNDays();
      dispatch(setGlobalLoading(true));
      await getMovieDetails(id) 
        .then((res) => setMovie(res.movie))
        .catch((err) => console.log(err))
      dispatch(setGlobalLoading(false));
    };
    getInformation();
  }, [id]);
  useEffect(() => {
    dispatch(setGlobalLoading(true));
    getListBooking();
    dispatch(setGlobalLoading(false));
  }, [id]);
  useEffect(() => {
    dispatch(setGlobalLoading(true));
    getListRate();
    dispatch(setGlobalLoading(false));
  }, [user]);
  useEffect(() => {
    const getInformation = async () => {
      dispatch(setGlobalLoading(true));
      await getUserFavorite()
        .then((res) => {
          setListFavorites(res.favorites)})
        .catch((err) => console.log(err));
      dispatch(setGlobalLoading(false));
    };
    getInformation();
  }, [user]);
  const resetBooking = () => {
    localStorage.removeItem('date');
    localStorage.removeItem('hour');
    localStorage.removeItem('seatNumber');
    setMethod(0);
    localStorage.setItem('method', 0);
    setInputs((prevState) => ({
      ...prevState,
      seatNumber: "",
      date: "",
      hour: ""
    }));
  };
  useEffect(() => {
    if(params){
      if(method == 1){
        let temp = params.get('status');
        if (temp === 'PAID') {
          handleSubmit();
        }
        else if(temp === 'CANCELLED'){
          toast.success("Hủy thanh toán thành công!");
        }
        else if(temp != null && temp != undefined){
          toast.error("Đặt vé thất bại!");
        }
        resetBooking();
      }
      else if(method == 2){
        let temp = params.get('vnp_ResponseCode');
        if (temp === '00') {
          handleSubmit();
        }
        else if(temp === '24'){
          toast.success("Hủy thanh toán thành công!");
        }
        else if(temp != null && temp != undefined){
          toast.error("Đặt vé thất bại!");
        }
        resetBooking();
      }
      else if(method == 3){
        const success = params.get('paypal');
        if(success === 'success'){
          handleSubmit();
        }
        else if(success === 'cancel'){
          toast.success("Hủy thanh toán PayPal!");
        }
        else if(success){
          toast.error("Thanh toán PayPal thất bại!");
        }
        resetBooking();
      }
      else{
        resetBooking();
      }
    }
  }, [params]);
  const handleSeatSelect = (index) => {
    localStorage.setItem('seatNumber', index+1);
    getListBooking();
    const newSelectedSeats = Array(selectedSeats.length).fill(false);
    newSelectedSeats[index] = true;
    setSelectedSeats(newSelectedSeats);
    setInputs((prevState) => ({
      ...prevState,
      seatNumber: index + 1
    }));
  };   
  const handleSubmit = async () => {
    if(isRequest) return;
    if(inputs.date == "") return;
    if(inputs.hour == "") return;
    if(inputs.seatNumber == "") return;
    console.log(inputs);
    setIsRequest(true);
    await newBooking({ ...inputs, movie: id })
      .then((res) => {toast.success("Đặt vé thành công!");
        setIn4(res.booking);
      })
      .catch((err) => toast.error(err));
    setIsRequest(false);
    const newSeatBooking = seatBooking;
    newSeatBooking[inputs.seatNumber - 1] = true;
    setSeatBooking(newSeatBooking);
    setSelectedSeats(Array(selectedSeats.length).fill(false));
    setInputs((prevInputs) => ({
      ...prevInputs,
      seatNumber: "",
      hour: "",
      date: ""
    }));
    getListBooking();
    setIsAppear(false);
    setIsOpen(true);
  };
  const handleTimeSelect = (i) => {
    localStorage.setItem('hour', listTime[i]);
    getListBooking();
    const newSelectedTime = Array(5).fill(false);
    newSelectedTime[i] = true;
    setSelectedTime(newSelectedTime);
    setInputs((prevState) => ({
      ...prevState,
      hour: listTime[i],
      seatNumber: ""
    }));
    const newSelectedSeats = Array(selectedSeats.length).fill(false);
    setSelectedSeats(newSelectedSeats);
  };  
  const handleDaySelect = (i) => {
    localStorage.setItem('date', listDay[i]);
    const newSelectedDay = Array(7).fill(false);
    newSelectedDay[i] = true;
    setSelectedDay(newSelectedDay);
    switch (listDay[i].getDay()) {
      case 0:
        setListTime(movie.suns.sort());
        break;
      case 1:
        setListTime(movie.mons.sort());
        break;
      case 2:
        setListTime(movie.tues.sort());
        break;
      case 3:
        setListTime(movie.weds.sort());
        break;
      case 4:
        setListTime(movie.thus.sort());
        break;
      case 5:
        setListTime(movie.fris.sort());
        break;
      case 6:
        setListTime(movie.sats.sort());
        break;
      default:
        break;
    }
    setSelectedTime([]);
    setInputs((prevState) => ({
      ...prevState,
      date: listDay[i],
      hour: "",
      seatNumber: ""
    }));
  };
  const renderTime = () => {
    const times = [];
    for (let i = 0; i < listTime.length; i++) {
      let isSelected = selectedTime[i] || false;
      const colorByState = {
        normal: "#949494",
        selected: "#2e7d31",
      }; 
      let color;
      if (isSelected) {
        color = colorByState.selected;
      } else {
        color = colorByState.normal;
      }
      const split = listTime.length > 3 ? listTime.length : 3;
      times.push(
        <Grid item xs={12/split} md={12/split}>
          <Grid>
            <Button
              variant="contained"
              style={{ backgroundColor: color, color: "white"}}
              onClick={() => handleTimeSelect(i)}
              //sx={{ m: 1 }}
              sx={{m:1, minWidth: 0 }}
              fullWidth
            >
              {listTime[i]}
            </Button>
          </Grid>
        </Grid>
      );
    }
    return times;
  };  
  const renderDay = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      let isSelected = selectedDay[i] || false;
      const colorByState = {
        normal: "#949494",
        selected: "#2e7d31",
      }; 
      let color;
      if (isSelected) {
        color = colorByState.selected;
      } else {
        color = colorByState.normal;
      }
      days.push(
        <Grid item xs={12/7} md={12/7}>
          <Grid>
            <Button
              variant="contained"
              style={{ backgroundColor: color, color: "white"}}
              onClick={() => handleDaySelect(i)}
              //sx={{ m: 1 }}
              sx={{m:1, minWidth: 0 }}
              fullWidth
            >
              {dayjs(listDay[i]).format("DD/MM")}
            </Button>
          </Grid>
        </Grid>
      );
    }
    return days;
  };
  const renderSeats = () => {
    const temp = dayjs(inputs.date).format("DD/MM/YYYY");
    {bookings && bookings.forEach((booking, index) => {
      const temp_date = dayjs(booking.date).format("DD/MM/YYYY");
      seatBooking[booking.seatNumber - 1] = (temp == temp_date && booking.hour == inputs.hour);
    })}
    const seats = [];
    for (let i = 0; i < 10; i++) {
      const column = [];
      for (let j = 0; j < 5; j++) {
        let index = j * 10 + i;        
        const seatNumber = index + 1; // Tính toán số chỗ ngồi
        const isBooked = seatBooking[index] || false;
        let isSelected = selectedSeats[index] || false;
        if(isBooked){
          isSelected = false;
          index = seatTemp;
        }
        const colorByState = {
          normal: "#949494",
          selected: "#2e7d31",
          booked: "#d3302f",
        };
      
        let color;
        if (isBooked) {
          color = colorByState.booked;
        } else if (isSelected) {
          color = colorByState.selected;
        } else {
          color = colorByState.normal;
        }
        column.push(
          <Grid>
          <Button
            variant="contained"
            style={{ backgroundColor: color, color: "white"}}
            onClick={() => handleSeatSelect(index)}
            //sx={{ m: 1 }}
            sx={{m:1, minWidth: 0 }}
            fullWidth
          >
            {seatNumber} {/* Hiển thị số chỗ ngồi */}
          </Button>
          </Grid>
        );
      }
      seats.push(<Grid item xs={1.2} md={1.2} >{column}</Grid>);
    }
    return seats;
  };
  const updateFavorite = async () => {
    await getUserFavorite()
      .then((res) => {
        setListFavorites(res.favorites);
      })
      .catch((err) => console.log(err));
  };
  const onFavoriteClick = async () => {
    if (!user) return dispatch(setAuthModalOpen(true));

    if (onRequest) return;

    if (listFavorites.some(e => e.movie.id.toString() === id.toString())) {
      onRemoveFavorite();
      return;
    }

    setOnRequest(true);
    await newFavorite({movie: movie.id })
      .then((res) => {updateFavorite(); toast.success("Thêm phim yêu thích thành công!");})
      .catch((err) => console.log(err));
    setOnRequest(false);
  };
  const onBookingClick = () => {
    if (!user) return dispatch(setAuthModalOpen(true));

    bookingsRef.current.scrollIntoView({ behavior: "smooth" });
  };
  const onRemoveFavorite = async () => {
    if (onRequest) return;
    setOnRequest(true);
    const favorite = listFavorites.find(e => e.movie.id.toString() === movie.id.toString());
    await deleteFavorite(favorite.id)
      .then((res) => {updateFavorite(); toast.success("Xóa phim yêu thích thành công!");})
      .catch((err) => console.log(err));
    setOnRequest(false);
  };
  const handleMethod1 = async () => {
    setMethod(1);
    localStorage.setItem('method', 1);
    setIsPayment(true);
    const response = await axios.post(`${backEndUrl}/booking/create_payment`, { amount, id });
    setIsPayment(false);
    if (response.data.code === '00') { 
        window.location.href = response.data.data;
    }
  };
  const handleMethod2 = async () => {
    setMethod(2);
    localStorage.setItem('method', 2);
    setIsPayment(true);
    const response = await axios.post(`${backEndUrl}/booking/create_payment_url`, { amount, id });
    setIsPayment(false);
    if (response.data.code === '00') { 
        window.location.href = response.data.data;
    }
  };
  const handleMethod3 = async () => {
    setMethod(3);
    localStorage.setItem('method', 3);
    setIsPayment(true);
    const response = await axios.post(`${backEndUrl}/booking/create_paypal_payment`, { amount, id });
    setIsPayment(false);
    if (response.data.code === '00') { 
        window.location.href = response.data.data;
    }
  };
  const handleMethod4 = async () => {
    try {
      setMethod(4);
      localStorage.setItem("method", 4);
      setIsPayment(true);

      if (!window.ethereum) {
        toast.error("Vui lòng cài một trong các ví sau: MetaMask, Trust Wallet (extension), Rabby Wallet, Brave Wallet");
        return;
      }

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      const network = await provider.getNetwork();
      if (network.chainId !== 1) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x1' }],
          });
          toast.success("Đã chuyển sang Ethereum Mainnet!");
        } catch (err) {
          toast.error("Không thể chuyển mạng. Vui lòng thực hiện thủ công.");
          throw err;
        }
      }

      const message = `Tôi xác nhận đặt vé phim "${movie.title}" tại ghế ${inputs.seatNumber}, ngày ${dayjs(inputs.date).format("DD/MM/YYYY")}, giờ ${inputs.hour}`;
      const signature = await signer.signMessage(message);

      // Gửi chữ ký để xác minh
      const verifyResponse = await axios.post(`${backEndUrl}/booking/verify_free_signature`, {
        address,
        signature,
        message
      });

      if (verifyResponse.data.code !== "00") {
        toast.error("Xác minh chữ ký thất bại!");
        return;
      }

      // // Lấy tỷ giá ETH/VND từ CoinGecko
      // const priceRes = await axios.get("https://api.coingecko.com/api/v3/simple/price", {
      //   params: {
      //     ids: "ethereum",
      //     vs_currencies: "vnd"
      //   }
      // });

      // const ethToVnd = priceRes.data?.ethereum?.vnd;
      // if (!ethToVnd) {
      //   toast.error("Không lấy được tỷ giá ETH/VND");
      //   return;
      // }

      // const vndAmount = 10000;
      // const ethAmount = vndAmount / ethToVnd;

      // // Gửi 10000 VND quy đổi ra ETH
      // const tx = await signer.sendTransaction({
      //   to: "0xE7A4bD492f7809fA5aBb7193a53aaBE5D82b69e3", // ví nhận
      //   value: parseEther(ethAmount.toString())
      // });
      // await tx.wait();

      handleSubmit();

    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi xác minh hoặc thanh toán!");
    } finally {
      setIsPayment(false);
    }
  };
  const handleWalletPayment = async () => {
    if (!userInfo) {
      toast.error("Không lấy được thông tin ví!");
      return;
    }
    if (userInfo.wallet < amount) {
      toast.error("Số dư ví không đủ để thanh toán!");
      return;
    }
    setMethod(4);
    localStorage.setItem("method", 4);
    setIsPayment(true);
    try {
      await axios.put(`/user/update-wallet/${userInfo.id}`, { amount: -amount });
      await handleSubmit();
      // Cập nhật lại số dư ví
      const { response, err } = await userApi.getInfo();
      if (response) setUserInfo(response);
    } catch (err) {
      toast.error("Thanh toán bằng ví thất bại!");
    }
    setIsPayment(false);
  };

  return (
    <div>
      {movie && 
        (
          <>
            <ImageHeader imgPath={movie.backgroundUrl} />
            <Box sx={{
              color: "primary.contrastText",
              ...uiConfigs.style.mainContent
            }}>
              {/* media content */}
              <Box sx={{
                marginTop: { xs: "-10rem", md: "-15rem", lg: "-20rem" }
              }}>
                <Box sx={{
                  display: "flex",
                  flexDirection: { md: "row", xs: "column" }
                }}>
                  {/* poster */}
                  <Box sx={{
                    width: { xs: "70%", sm: "50%", md: "40%" },
                    margin: { xs: "0 auto 2rem", md: "0 2rem 0 0" }
                  }}>
                    <Box sx={{
                      paddingTop: "140%",
                      ...uiConfigs.style.backgroundImage(movie.posterUrl)
                    }} />
                  </Box>
                  {/* poster */}
    
                  {/* media info */}
                  <Box sx={{
                    width: { xs: "100%", md: "60%" },
                    color: "text.primary"
                  }}>
                    <Stack spacing={5}>
                      {/* title */}
                      <Typography
                        variant="h4"
                        fontSize={{ xs: "2rem", md: "2rem", lg: "4rem" }}
                        fontWeight="700"
                        sx={{ ...uiConfigs.style.typoLines(2, "left") }}
                      >
                        {`${movie.title} ${dayjs(movie.releaseDate).format("DD/MM/YYYY")}`}
                      </Typography>
                      {/* title */}
    
                      {/* rate and genres */}
                      <Stack direction="row" spacing={1} alignItems="center">
                        {/* rate */}
                        <CircularRate value={movie.averageRating} />
                        {/* rate */}
                        <Divider orientation="vertical" />
                        {/* genres */}
                        {movie.genres.map((genre, index) => (
                          <Chip
                            label={genre}
                            variant="filled"
                            color="primary"
                            key={index}
                          />
                        ))}
                        {/* genres */}
                      </Stack>
                      {/* rate and genres */}
    
                      {/* overview */}
                      <Typography
                        variant="body1"
                        sx={{ ...uiConfigs.style.typoLines(5) }}
                      >
                        {movie.description}
                      </Typography>
                      {/* overview */}
    
                      {/* buttons */}
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Rating
                            name="rating"
                            value={value}
                            onChange={handleChange}
                            precision={0.5}
                            min={0}
                            max={5}
                            />
                          <Typography ml={2} variant="body2">{value * 2}</Typography>
                      </Box>
                      {!admin && (
                        <Stack direction="row" spacing={1}>
                          <LoadingButton
                            variant="text"
                            sx={{
                              width: "max-content",
                              "& .MuiButon-starIcon": { marginRight: "0" }
                            }}
                            size="large"
                            startIcon={listFavorites.some(e => e.movie.id.toString() === id.toString()) ? <FavoriteIcon /> : <FavoriteBorderOutlinedIcon />}
                            loadingPosition="start"
                            loading={onRequest}
                            onClick={onFavoriteClick}
                            />
                          <Button
                            variant="contained"
                            sx={{ width: "max-content" }}
                            size="large"
                            //startIcon={<PlayArrowIcon />}
                            onClick={onBookingClick}
                            >
                            đặt vé
                          </Button>
                        </Stack>
                      )}
                      {/* buttons */}
    
                      {/* cast */}
                      <Container header="Diễn viên">
                        <CastSlide casts={movie.actors} />
                      </Container>
                      {/* cast */}
                    </Stack>
                  </Box>
                  {/* media info */}
                </Box>
              </Box>
              {/* media content */}
              <div>
                <Modal
                    open={isAppear}
                    onClose={handleClose}
                    >
                  <Box sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "100%",
                    maxWidth: "600px",
                    padding: 4,
                    outline: "none"
                  }}>
                    <Box sx={{ padding: 4, boxShadow: 24, backgroundColor: "background.paper" }}>
                      <Box sx={{ textAlign: "center", marginBottom: "2rem" }}>
                        <Stack spacing={1} justifyContent={"center"} alignItems={"center"}>
                          <Typography variant="h5">
                            Thông tin đã chọn
                          </Typography>
                          <Typography variant="caption">
                            Ngày chiếu phim: {dayjs(inputs.date).format("DD/MM/YYYY")}
                          </Typography>
                          <Typography variant="caption">
                            Giờ chiếu phim: {inputs.hour}
                          </Typography>
                          <Typography variant="caption">
                            Vị trí ghế: {inputs.seatNumber}
                          </Typography>                               
                        </Stack>
                        <Stack borderRadius={"20px"} border={"2px solid green"} marginTop={4} justifyContent={"center"} alignItems={"center"}>
                          <Typography variant="h5">
                            Hãy chọn phương thức thanh toán
                          </Typography>
                          <LoadingButton
                            variant="contained"
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              marginTop: 2,
                              width: 'max-content',
                              paddingRight: 2,
                            }}
                            loading={isPayment}
                            onClick={handleWalletPayment}
                          >
                            Ví ({userInfo ? `${userInfo.wallet} VNĐ` : "..."})
                          </LoadingButton>
                          <LoadingButton
                            variant="contained"
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              marginTop: 2,
                              width: 'max-content',
                              paddingRight: 2, // Add some padding to the right to accommodate the icon
                            }}
                            loading={isPayment}
                            onClick={handleMethod1}
                          >
                            QRCODE
                            <QrCodeIcon sx={{ marginLeft: 1 }} />
                          </LoadingButton> 
                          <LoadingButton
                            variant="contained"
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              marginTop: 2,
                              width: 'max-content',
                              paddingRight: 2,
                            }}
                            loading={isPayment}
                            onClick={handleMethod3}
                          >
                            PAYPAL
                            <img
                              src="https://www.paypalobjects.com/webstatic/icon/pp258.png"
                              alt="paypal"
                              style={{ width: 24, height: 24, marginLeft: 8 }}
                            />
                          </LoadingButton>
                          <LoadingButton
                            variant="contained"
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              marginTop: 2,
                              width: 'max-content',
                              paddingRight: 2,
                            }}
                            loading={isPayment}
                            onClick={handleMethod4}
                          >
                            Crypto
                          </LoadingButton>
                          <LoadingButton
                            variant="contained"
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              marginTop: 2,
                              marginBottom: 2,
                              width: 'max-content',
                              paddingRight: 2, // Add some padding to the right to accommodate the icon
                            }}
                            loading={isPayment}
                            onClick={handleMethod2}
                          >
                            VNPAYMENT
                            <div
                              style={{
                                marginLeft: 8, // Space between text and image
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                                overflow: 'hidden',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <img
                                src="https://i.postimg.cc/CMvHpxMW/0oxhzjmxbksr1686814746087.png" // Replace with the URL of your image
                                alt="QR Code"
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                }}
                              />
                            </div>
                          </LoadingButton>                          
                        </Stack>
                      </Box>
                    </Box>
                  </Box>
                </Modal>
              </div>
              <div>
                <Modal
                    open={isOpen}
                    onClose={handleClose}
                    >
                  <Box sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "100%",
                    maxWidth: "600px",
                    padding: 4,
                    outline: "none"
                  }}>
                    <Ticket booking={in4} title={movie.title}/>
                  </Box>
                </Modal>
              </div>
              {/* media backdrop */}
              {movie.backdrops.length > 0 && (
                <Container header="Một số cảnh trong phim">
                  <BackdropSlide backdrops={movie.backdrops} />
                </Container>
              )}
              {/* media backdrop */}
              {/* media videos */}
              <div style={{ paddingTop: "2rem" }}>
                <Container header="Trailer">
                  <MediaVideos URL={movie.videoUrl} />
                </Container>
              </div>
              {/* media videos */}
              {/* media videos */}
              <div ref={bookingsRef} style={{ paddingTop: "2rem" }}>
                {!admin && user && (
                  <Container header="Đặt vé">
                    {movie && (
                      <Fragment>
                        <Box display={"flex"} justifyContent={"center"}>
                          <Typography
                            variant="h5"
                            fontSize={{ xs: "1rem", md: "1rem", lg: "2rem" }}
                            fontWeight="700"
                            sx={{ ...uiConfigs.style.typoLines(2, "left") }}
                          >
                            Chọn ngày chiếu phim
                          </Typography>
                        </Box>
                        <Box display={"flex"} justifyContent={"center"}>
                          <Grid justifyContent={"center"} width={{xs: "90%", sm:"70%", md:"50%"}} container spacing={{ xs: 1, md: 2 }}>
                            {renderDay()}
                          </Grid>
                        </Box>
                        {inputs.date != "" && (
                          <Box>
                            <Box display={"flex"} justifyContent={"center"}>
                              <Typography
                                variant="h5"
                                fontSize={{ xs: "1rem", md: "1rem", lg: "2rem" }}
                                fontWeight="700"
                                sx={{ ...uiConfigs.style.typoLines(2, "left") }}
                              >
                                Chọn giờ chiếu phim
                              </Typography>
                            </Box>
                            <Box display={"flex"} justifyContent={"center"}>
                              <Grid justifyContent={"center"} width={{xs: "90%", sm:"70%", md:"50%"}} container spacing={{ xs: 1, md: 2 }}>
                                {renderTime()}
                              </Grid>
                            </Box>
                          </Box>
                        )}
                        {inputs.hour != "" && (
                          <Box>
                            <Box display={"flex"} justifyContent={"center"}>
                              <Typography
                                variant="h5"
                                fontSize={{ xs: "1rem", md: "1rem", lg: "2rem" }}
                                fontWeight="700"
                                sx={{ ...uiConfigs.style.typoLines(2, "left") }}
                              >
                                Vị trí ghế ngồi
                              </Typography>
                            </Box>
                            <Box display="flex" justifyContent="center" > 
                              <Box display="flex" alignItems="center" marginRight={2}>
                                <Box width={20} height={20} bgcolor="#d3302f" marginRight={1}></Box>
                                <Typography>Đã bán</Typography>
                              </Box>
                              <Box display="flex" alignItems="center" marginRight={2}>
                                <Box width={20} height={20} bgcolor="#2e7d31" marginRight={1}></Box>
                                <Typography>Đã chọn</Typography>
                              </Box>
                              <Box display="flex" alignItems="center" marginRight={2}>
                                <Box width={20} height={20} bgcolor="#949494" marginRight={1}></Box>
                                <Typography>Trống</Typography>
                              </Box>
                            </Box>
                            <Box display="flex" justifyContent="center">                                                 
                              <Button
                                variant="contained"
                                color="primary"
                                sx={{ m: 1, width: {xs: "90%", sm:"70%", md:"50%"}}}
                              >
                                MÀN HÌNH
                              </Button>                     
                            </Box>
                            <Box display={"flex"} justifyContent={"center"}>
                              <Grid width={{xs: "100%", sm:"80%", md:"60%"}} container spacing={{ xs: 0.5, md: 1 }}>
                                {renderSeats()}
                              </Grid>
                            </Box>
                            <Box display="flex" justifyContent="center" >
                              <Box width={"80%"} marginTop={3}>
                                <Box display="flex" justifyContent={"center"}>             
                                  <Button onClick={handleOpen} sx={{bgcolor: "#add8e6",":hover": {bgcolor: "#121217"}, width: {xs: "20%", sm:"15%", md:"10%"}}}>
                                    Đặt vé
                                  </Button>                 
                                </Box>
                              </Box>
                            </Box>
                          </Box>
                        )}
                      </Fragment>
                    )}
                  </Container>
                )}
              </div>
            </Box>
            <Box marginTop="-4rem" sx={{ ...uiConfigs.style.mainContent }}>
              <Container header="Có thể bạn sẽ thích">
                {user && (<MediaSlide movies={recommendedMovies} type={1}/>)}
                {!user && (<MediaSlide movies={movies} type={1}/>)}
              </Container>
            </Box>
          </>
        )
      }
    </div>
  );
};

export default MediaDetail;