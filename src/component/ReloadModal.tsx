import { useAppDispatch, useAppSelector } from '@/app/hooks/redux.hooks';
import { clearAuth, updateReload } from '@/app/redux/actions/authSlice';
import Button from '@/input-components/Button';
import { Box, Modal } from '@mui/material';
import { useRouter } from 'next/navigation';
import React from 'react'

const ReloadModal = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const showReloadModal = useAppSelector(state => state.auth.isReload)

    return (
        <Modal
            open={showReloadModal ?? true}
            disableEscapeKeyDown={true}
            disableEnforceFocus={true}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 450,
                    outline: 'none',
                    bgcolor: "background.paper",
                    borderRadius: 2,
                    boxShadow: 24,
                    p: 3,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                }}
            >
                <p>Your session has expired. Please login again</p>
                <div className="mt-8">
                    <div className="flex justify-end">
                        <div>
                            <Button
                                variant='outlined'
                                className='bg-secondary'
                                onClick={() => {
                                    window.location.href = "http://localhost:3000";
                                    dispatch(updateReload({ isReload: false }));
                                }}
                                label="Login"
                            />
                        </div>
                    </div>
                </div>
            </Box>
        </Modal>
    )
}

export default ReloadModal