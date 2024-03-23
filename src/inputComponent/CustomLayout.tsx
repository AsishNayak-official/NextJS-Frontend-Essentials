'use client'

import { getBusinessUnit, getJobDetails, getLocations, getSkills } from '@/api/requisitions';
import { useAppDispatch, useAppSelector } from '@/app/hooks/redux.hooks';
import { updateAuth } from '@/app/redux/actions/authSlice';
import { updateBusinessUnits, updateJobDetails, updateLocations, updateSkills } from '@/app/redux/actions/optionsSlice';
import Navbar from "@/components/nav/Navbar";
import SidePanel from "@/components/nav/SidePanel";
import Hidden from "@mui/material/Hidden";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { jwtDecode } from "jwt-decode";
import { Poppins } from "next/font/google";
import { SnackbarProvider } from "notistack";
import React, { useEffect } from "react";
import { CustomJWTPayload } from './types/interfaces';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { clearAuth } from './redux/actions/requisitionSlice';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ReloadModal from '@/components/ReloadModal';

interface ICustomLayout {
    children: any;
}
const queryClient = new QueryClient()

const poppins = Poppins({
    weight: ['400'],
    subsets: ['latin'],
    display: 'swap',
});
const CustomLayout: React.FC<ICustomLayout> = ({ children }) => {
    const router = useRouter();

    const isLogged = useAppSelector(state => state.auth.isLogged);
    const showReloadModal = useAppSelector(state => state.auth.isReload)
    const dispatch = useAppDispatch();

    useEffect(() => {
        const accessToken = Cookies.get('accessToken');
        const refreshToken = Cookies.get('refreshToken');
        if (!isLogged && accessToken) {
            const { name = '', email = '', role = '', exp = Date.now() } = jwtDecode<CustomJWTPayload>(accessToken)
            // if (Date.now() > exp) {
            //     dispatch(clearAuth());
            //     router.replace('/')
            // }
            console.log({ accessToken, refreshToken, name, email, role, exp });

            dispatch(updateAuth({ accessToken: accessToken, refreshToken: refreshToken, isLogged: true, email, role, name }));
            getLocations()
                .then((locationRes) => {
                    if (locationRes?.data?.success) {
                        dispatch(updateLocations({ locations: locationRes?.data?.data }));
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
            getBusinessUnit()
                .then((buRes) => {
                    if (buRes?.data?.success) {
                        dispatch(updateBusinessUnits({ businessUnits: buRes?.data?.data }));
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
            getSkills()
                .then((skillsRes) => {
                    if (skillsRes?.data?.success) {
                        dispatch(updateSkills({ skills: skillsRes?.data?.skills }));
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
            getJobDetails()
                .then((jobDetailsRes) => {
                    if (jobDetailsRes?.data?.success) {
                        dispatch(updateJobDetails({ jobDetails: jobDetailsRes?.data?.jobDetails }));
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }
        return (() => { })
    }, [isLogged]);

    useEffect

    const theme = createTheme({
        typography: {
            fontFamily: poppins.style.fontFamily,
        },
        palette: {
            primary: {
                light: "#757ce8",
                main: "#723792",
                dark: "#002884",
                contrastText: "#fff",
            },
            secondary: {
                light: "#ff7961",
                main: "#F1D6FF",
                dark: "#ba000d",
                contrastText: "#fff",
            },
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <SnackbarProvider>
                <QueryClientProvider client={queryClient}>
                    {isLogged ? (
                        <div className="flex justify-center items-center">
                            <Hidden lgDown>
                                <div className="w-1/6 min-w-[200px] relative">
                                    <SidePanel />
                                </div>
                            </Hidden>
                            <div className="h-[6%]">
                                <Navbar />
                            </div>
                            {showReloadModal ? <ReloadModal /> : <div className='w-5/6 h-full mt-[5%] overflow-auto relative px-8'>
                                {children}
                            </div>}
                        </div>
                    ) : (
                        <>{children}</>
                    )}
                </QueryClientProvider>
            </SnackbarProvider>
        </ThemeProvider >
    );
};

export default CustomLayout;