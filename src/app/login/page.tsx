"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import AuthForm from "./_components/auth-form";
import { useEffect } from "react";
import { useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";

import loginScreenOne from "@/assets/login/login-screen-one.png";
import loginScreenTwo from "@/assets/login/login-screen-two.png";
import loginScreenThree from "@/assets/login/login-screen-three.png";

import "swiper/css";
import "swiper/css/pagination";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem('userToken');
    const clientId = localStorage.getItem('clientId');

    if (token && clientId) {
      router.replace("/");
    }
  }, [router]);
  const images = [
    { id: 1, src: loginScreenOne },
    { id: 2, src: loginScreenTwo },
    { id: 3, src: loginScreenThree },
  ];
  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <div className="flex h-[700px] lg:w-[900px] w-full items-center justify-center mx-auto">
        <div className="hidden lg:flex w-1/2 items-center justify-center relative">
          <Swiper
            pagination={{ clickable: true }}
            modules={[Pagination, Autoplay]}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            loop={true}
            className="mySwiper"
          >
            {images.map((image) => (
              <SwiperSlide key={image.id} className="w-full">
                <Image
                  src={image.src}
                  alt="Zuperior"
                  className="h-[650px] w-[450px] object-cover rounded-xl"
                />
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="absolute z-20 text-white text-3xl font-semibold px-8 top-12">
            <p>Think Superior,</p>
            <p>Trade Zuperior</p>
          </div>
        </div>

        <div className="flex-1 text-white bg-black flex items-center justify-center">
          <AuthForm />
        </div>
      </div>
    </div>
  );
}