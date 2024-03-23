"use client"
import { createRequisition, getAllRequisitionsOnlyName, getHiringManager, getRequisitionProfile } from '@/api/requisitions'
import { useAppSelector } from '@/app/hooks/redux.hooks'
import AddInputField from '@/input-components/AddInputField'
import AutoComplete from '@/input-components/AutoComplete'
import Button from '@/input-components/Button'
import DraggerWithPreSignedURLWrapper from '@/input-components/DraggerWithPresignedUrl'
import InputFieldWithChips from '@/input-components/InputFieldWithChip'
import Loader from '@/input-components/Loader'
import useNotification from '@/input-components/Notification/useNotifications'
import Select from '@/input-components/Select'
import { TextInputField } from '@/input-components/TextInputField'
import TypeAhead from '@/input-components/TypeAhead'
import { ROLES } from '@/utils/constants'
import { validateForm } from '@/validations/CreateRequisitionValidation'
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import { Box, Divider, Modal } from '@mui/material'
import { Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import { ZodError } from 'zod'



interface IModalState {
    open: boolean;
    handleCloseModal: () => void;
}

interface IDescription {
    Key?: string;
    MIMEType?: string;
    name?: string;
    size?: number;
};

const CloneRequisitionModal: React.FC<IModalState> = ({ open, handleCloseModal }) => {
    const [formErrors, setFormErrors] = useState<ZodError | null>(null);
    const [interviewRounds, setInterviewRounds] = useState<string[]>(['']);
    const [jobDetails, setJobDetails] = useState([{ title: '', band: '', grade: '' }])
    const [titleOptions, setTitleOptions] = useState<string[]>(['']);
    const [panelists, setPanelists] = useState<string[]>(['']);
    const [isFormLoading, setIsFormLoading] = useState(false);
    const [requisitionID, setRequisitionID] = useState('');
    const [allRequisitions, setAllRequisitions] = useState([]);
    const [hiringManager, setHiringManager] = useState('');
    const [hiringManagers, setHiringManagers] = useState([]);
    const [requisitionObject, setRequisitionObject] = useState({
        title: "",
        band: '',
        grade: '',
        skills: [] as string[],
        description: [] as IDescription[],
        location: [],
        maxExperience: 0,
        minExperience: 0,
        businessUnit: '',
        panelists: [] as string[],
        interviewRounds: [] as string[],
    });

    const userRole = useAppSelector(state => state.auth.role);
    const notification = useNotification();

    const skillOptions = useAppSelector((state) => state.requisitionOptions.skills)
    const businessUnitsOptions = useAppSelector((state) => state.requisitionOptions.businessUnits)
    const locationOptions = useAppSelector((state) => state.requisitionOptions.locations)
    const jobDetailsOptions = useAppSelector((state) => state.requisitionOptions.jobDetails)

    useEffect(() => {
        if (userRole !== ROLES.HIRING_MANAGER && userRole !== ROLES.PANELIST) {
            getHiringManager().then(res => {
                setHiringManagers(res.data.data);
            }).catch(err => {
                setHiringManagers([])
            })
        }
    }, [userRole])


    useEffect(() => {
        getAllRequisitionsOnlyName().then(res => {
            setAllRequisitions(res.data.data)
        }).catch(err => {
            notification.error("Error while fetching data!")
        })
    }, []);


    useEffect(() => {
        if (requisitionID) {
            getRequisitionProfile(requisitionID).then(res => {
                setRequisitionObject({
                    ...(res.data?.data ?? {}),
                    description: [
                        {
                            Key: res.data.data.jobDescriptionFileKey.key,
                            MIMEType: res.data.data.jobDescriptionFileKey.type,
                            name: 'Resume',
                            size: 1024,
                        }
                    ]
                })
            }).catch(err => {
                notification.error("Error while fetching data!")
            })
        }
    }, [requisitionID])

    useEffect(() => {
        if (jobDetailsOptions) {
            setJobDetails(jobDetailsOptions)
        }
    }, [jobDetailsOptions])

    const handleTextFieldsChange = (updatedTextFields: string[]) => {
        setInterviewRounds(updatedTextFields);
    };

    const handleClose = () => {
        handleCloseModal();
        setFormErrors(null);
    };

    const renderFieldErrors = (fieldName: string) => {
        return (
            <span className="text-red-600 text-sm">
                {formErrors !== null && formErrors?.errors
                    .filter(error => error?.path?.[0] === fieldName)
                    .map((error, index) => (
                        <span key={index}>{error?.message ?? ''}</span>
                    ))[0]}
            </span>
        );
    };

    useEffect(() => {
        if (jobDetails) {
            const titles = jobDetails?.map(job => job?.title);
            setTitleOptions(titles);
        }
    }, [jobDetails])


    const handleSubmit = async (values: { title: string; band: string; grade: string; skills: string[]; description: IDescription[]; location: string[]; maxExperience: number; minExperience: number; businessUnit: string; panelists: string[]; interviewRounds: string[] }) => {
        const description = { key: values?.description[0]?.Key, type: values?.description[0]?.MIMEType };
        console.log({ panelists })
        setIsFormLoading(true);
        createRequisition(
            values?.band, values?.grade, values?.title,
            description,
            values?.skills,
            values?.businessUnit,
            panelists,
            values?.interviewRounds,
            values?.location,
            values?.maxExperience,
            values?.minExperience,
            userRole !== ROLES.HIRING_MANAGER ? hiringManager : null
        )
            .then((res) => {
                if (res.data.success) {
                    setIsFormLoading(false)
                    notification.success("Successfully! created requisition!");
                    handleClose();
                } else {
                    setIsFormLoading(false);
                    notification.error("Error while creating requisition!")
                }
            })
            .catch((error) => {
                setIsFormLoading(false)
                notification.error("Error while creating requisition!")
            })


    }

    function handleChips(newChips: string[]): void {
        setPanelists(newChips)
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
            className='flex h-auto justify-center items-center'
        >
            <Loader isLoading={isFormLoading}>
                <Box
                    sx={{
                        width: "1100px",
                        maxWidth: '1100px',
                        height: 'auto',
                        backgroundColor: "white",
                        display: 'flex',
                        flexDirection: "column",
                        borderRadius: "8px",
                        padding: '50px 40px',
                        overflowY: "auto",
                        "&::-webkit-scrollbar": {
                            display: 'none',
                        },
                    }}
                >
                    <div className='flex flex-col'>
                        <div className="flex w-full justify-between items-center mb-10">
                            <div className=''>
                                <Button
                                    startIcon={<ArrowBackIcon />}
                                    onClick={handleClose}
                                    className="flex flex-start w-auto p-0 text-black text-sm"
                                    label={'Back'} />
                            </div>
                            <div className=' text-center font-medium text-2xl p-0'>
                                Clone Requisition
                            </div>
                            <div>
                                <Button label={"Clone"} form='createRequisitionForm' type='submit' className="bg-[#A459D1] text-md rounded-2xl px-5 py-4 text-white hover:text-white hover:bg-[#A459D1] h-6" />
                            </div>
                        </div>
                        <Formik
                            enableReinitialize={true}
                            initialValues={requisitionObject}
                            onSubmit={async (values) => {
                                values.interviewRounds = interviewRounds.filter(round => round.trim() !== '');
                                const validationErrors = await validateForm(values);
                                console.log({ values });
                                setFormErrors(validationErrors);
                                if (!validationErrors) {
                                    handleSubmit(values)
                                }
                            }}>
                            {({ values, setValues, setFieldValue, handleChange, getFieldProps }) => (
                                <Form className='flex flex-col w-[100%]'
                                    id='createRequisitionForm'
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                        }
                                    }}
                                >
                                    <div className='w-full mb-5 flex gap-6'>
                                        <div className='w-full mb-5'>
                                            <Select
                                                label={'Requisition'}
                                                optionsWithKeys={Object.fromEntries(allRequisitions.map((item: any) => (
                                                    [[item?.requisitionID ?? ''], `${item?.requisitionID}-${item.title}`]
                                                )))}
                                                onChange={(event: any) => {
                                                    setRequisitionID(event.target.value);
                                                }}
                                            />
                                            {renderFieldErrors('title')}
                                        </div>
                                        {
                                            userRole !== ROLES.HIRING_MANAGER && (
                                                <div className='w-full'>
                                                    <AutoComplete
                                                        textFieldProps={{ label: 'Hiring Manager', name: 'hiringManager', required: true, value: hiringManager ?? '' }}
                                                        options={hiringManagers.map((item: any) => item?.email ?? '')}
                                                        onChange={(event: any, newValues: string) => {
                                                            setHiringManager(newValues);
                                                        }}
                                                    />
                                                    {userRole !== ROLES.HIRING_MANAGER && !hiringManager}
                                                </div>
                                            )
                                        }
                                    </div>
                                    <div className='flex gap-4 '>
                                        <div className='w-1/2 space-y-4 '>
                                            <div className='flex gap-6'>
                                                <div className='w-1/2'>
                                                    <TextInputField
                                                        name='band'
                                                        label='Band'
                                                        disabled
                                                        value={values?.band || ''}
                                                        className='border-tertiary'
                                                    />
                                                </div>
                                                <div className='w-1/2'>
                                                    <TextInputField
                                                        label="Grade"
                                                        name='grade'
                                                        disabled
                                                        value={values?.grade || ''}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <TypeAhead
                                                    name='skills'
                                                    setFieldValue={setFieldValue}
                                                    textFieldProps={{ label: `Skills*`, name: 'skills' }}
                                                    value={values?.skills}
                                                    disabled={!requisitionID}
                                                    onChange={(event: any, newValues: string[]) => {
                                                        setFieldValue('skills', newValues);
                                                    }} options={skillOptions || ['']}
                                                />
                                                {renderFieldErrors('skills')}
                                            </div>
                                            <div>
                                                <label className='text-sm text-tertiary'>Job Description *</label>
                                                <DraggerWithPreSignedURLWrapper
                                                    disabled={values?.description?.length > 0 || !requisitionID}
                                                    name='description'
                                                    urlToFetchPreSignedUploadURL='requisition/createPresignedURL'
                                                    formik={{ values, setValues, setFieldValue, handleChange, getFieldProps }}
                                                    allowedFiles={['PDF']}
                                                />
                                                {renderFieldErrors('description')}
                                            </div>
                                            <div>
                                                <TypeAhead
                                                    name='location'
                                                    setFieldValue={setFieldValue}
                                                    disabled={!requisitionID}
                                                    textFieldProps={{ label: `Locations*`, name: 'location' }}
                                                    value={values?.location}
                                                    onChange={(event: any, newValues: string[]) => {
                                                        setFieldValue('location', newValues);
                                                    }}
                                                    options={locationOptions || ['']}
                                                />
                                                {renderFieldErrors('location')}
                                            </div>
                                            <div>
                                                <AutoComplete
                                                    textFieldProps={{ label: 'Business Unit', required: true, name: 'businessUnit', value: values?.businessUnit ?? '' }}
                                                    options={businessUnitsOptions || ['']}
                                                    value={values?.businessUnit ?? ''}
                                                    disabled={!requisitionID}
                                                    onChange={(event: any, newValues: string[]) => {
                                                        setFieldValue('businessUnit', newValues);
                                                    }}
                                                />
                                                {renderFieldErrors('businessUnit')}
                                            </div>
                                        </div>
                                        <Divider orientation="vertical" flexItem className='mx-2' />
                                        <div className='w-1/2 space-y-4' >

                                            <div>
                                                <div className='flex gap-6'>
                                                    <div className='w-1/2'>
                                                        <TextInputField
                                                            label='Min Experience'
                                                            disabled={!requisitionID}
                                                            name='minExperience'
                                                            type='number'
                                                            inputProps={{ min: 0, max: 100 }}
                                                            value={values?.minExperience}
                                                            onChange={handleChange}
                                                            className='border-tertiary'
                                                            required
                                                        />
                                                        {renderFieldErrors('minExperience')}
                                                    </div>
                                                    <div className='w-1/2'>
                                                        <TextInputField
                                                            disabled={!requisitionID}
                                                            label='Max Experience'
                                                            name='maxExperience'
                                                            type='number'
                                                            inputProps={{ min: 0, max: 100 }}
                                                            value={values?.maxExperience}
                                                            onChange={handleChange}
                                                            className='border-tertiary'
                                                            required
                                                        />
                                                        {renderFieldErrors('maxExperience')}
                                                    </div>

                                                </div>
                                            </div>
                                            <div className={`${!requisitionID ? 'pointer-events-none opacity-70' : ''}`} >
                                                <label className='text-sm text-tertiary'>Interview Rounds&nbsp;*</label>
                                                <AddInputField onTextFieldsChange={handleTextFieldsChange} values={values?.interviewRounds ?? []} />
                                                {renderFieldErrors('interviewRounds')}
                                            </div>

                                            <div>
                                                <InputFieldWithChips
                                                    updateChips={handleChips}
                                                    values={values.panelists}
                                                    disabled={!requisitionID}
                                                    textFieldProps={{ label: 'Panelists*', placeholder: 'example@eximietas.design or example@stovl.io' }} />
                                                {renderFieldErrors('panelist')}
                                            </div>
                                        </div>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </Box>
            </Loader>
        </Modal>
    )
}

export default CloneRequisitionModal