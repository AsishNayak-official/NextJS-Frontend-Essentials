'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import { type FormikProps } from 'formik';
import customAxios from "../api/index"
import axios from 'axios';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import useNotification from './Notification/useNotifications';
import { FileUploader } from 'react-drag-drop-files';
import Loader from './Loader';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';


interface DraggerWithPreSignedURLWrapperProps {
  label?: string;
  name: string;
  formik: any;
  urlToFetchPreSignedUploadURL?: string;
  disabled?: boolean;
  deleteDisabled?:boolean;
  divClasses?: string;
  maxFilesCount?: number;
  allowedFiles?: Array<
    | 'PDF'
    | 'EXCEL'
    | 'CSV'
    | 'SVG'
    | 'PNG'
    | 'JPEG'
    | 'GIF'
    | 'XML'
    | 'ZIP'
    | 'RAR'
    | '7Z'
    | 'WORD'
  >;
}

const allowedTypesValues = {
  PDF: ['application/pdf'],
  EXCEL: [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],
  CSV: ['text/csv'],
  SVG: ['image/svg+xml'],
  PNG: ['image/png'],
  JPEG: ['image/jpeg'],
  GIF: ['image/gif'],
  XML: ['application/xml'],
  ZIP: ['application/zip'],
  RAR: ['application/vnd.rar'],
  '7Z': ['application/x-7z-compressed'],
  WORD: [
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
};

const DraggerWithPreSignedURLWrapper = ({
  label,
  name,
  formik,
  disabled,
  deleteDisabled,
  urlToFetchPreSignedUploadURL,
  maxFilesCount = 1,
  allowedFiles = ['PDF', 'WORD'],
  ...props
}: DraggerWithPreSignedURLWrapperProps): JSX.Element => {
  // let { values, touched, errors } = formik;
  const fieldProps = formik?.getFieldProps(name);
  const notification = useNotification();

  // const accept = allowedFiles
  // 	?.reduce((previousValue: [], currentValue) => {
  // 		// @ts-expect-error don't know what is type "never"
  // 		previousValue.push(...allowedTypesValues[currentValue]);
  // 		return previousValue;
  // 	}, [])
  // 	.join(', ');

  const [isLoading, setIsLoading] = useState(false);

  const customUploadReqHandler = async (file: File): Promise<void> => {
    if (!file) {
      return;
    }
    if (!(file instanceof File)) {
      notification.error('Please select a valid file.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {//Set size for now is 2 MB
      notification.error('File is too large to be uploaded');
      return;
    }
    if (fieldProps?.value?.length >= maxFilesCount) {
      notification.error(`Cannot upload more than ${maxFilesCount} files`)
      return;
    }
    try {
      setIsLoading(true);
      const axiosResponse = await customAxios.get(urlToFetchPreSignedUploadURL ?? '');
      if (axiosResponse?.data?.success !== true) {
        notification.error('Failed to upload file, Try again.');
      }
      const { preSignedUrl, Key } = axiosResponse?.data?.data;
      const axiosInstance = axios.create();
      const axiosResponseOfPutRequest = await axiosInstance.put(preSignedUrl, file, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,PUT,HEAD,DELETE',
          'Access-Control-Allow-Credentials': true,
          'Content-Type': file.type,
        },
      });
      if (axiosResponseOfPutRequest?.status !== 200) {  
        notification.error('Failed to upload file, Try again.');
        setIsLoading(false);
        return;
      }
      formik?.setFieldValue(name, [
        ...fieldProps?.value,
        {
          Key,
          name: file?.name ?? '',
          MIMEType: file?.type ?? '',
          size: file?.size ?? null,
          // password: '',
          // isPasswordAdded: false,
        },
      ]);
      setIsLoading(false);
    } catch (error) {
      notification.error('Error while uploading file, Try again.');
      setIsLoading(false);
    }
  };

  const removeDocument = (index: any): void => {
    const files = [...fieldProps?.value];
    files.splice(index, 1);
    formik?.setFieldValue(name, files);
  };

  return (
    <div className='flex w-full flex-col'>
      {deleteDisabled?<></>:
      <div className={['mt-0 bg-secondary border-dashed rounded-lg border-primary border-2 w-full', props.divClasses].join(' ')}>
      <label className="formikLabel">{label}</label>
      <div className={'mt-1.5'} style={{ pointerEvents: formik?.values?.[name]?.length > 0 ? 'none' : 'auto' }}>
          <FileUploader
            multiple={false}
            className="bulk-wrapper-dragger my-1 w-full"
            handleChange={(file: File) => {
              void customUploadReqHandler(file);
            }}
            name="file"
            types={allowedFiles}
            disabled={disabled}
          >
            <div className="min-h-20">
              <Loader isLoading={isLoading}>
                <div className="flex flex-col justify-center items-center py-3 cursor-pointer border border-[#EAECF0] rounded-xl">
                  <CloudUploadOutlinedIcon />
                  <p className="text-sm text-[#475467] font-normal mb-1">
                    <span className="text-[#405CD2] font-semibold">
                      Click to upload
                    </span>{' '}
                    or drag and drop
                  </p>
                  <p className="text-[#475467] text-xs">
                    {allowedFiles.join(' / ')} Max: 2MB
                  </p>
                </div>
              </Loader>
            </div>
          </FileUploader>
        </div>
      </div>
      }
      <div className="flex">
          {fieldProps?.value?.map((item: any, index: any) => {
            return (
              <div
                className=" w-1/3 mt-4 rounded-xl p-3 border-primary border-dashed border-2 bg-secondary"
                key={item.Key}
              >
                <div className="flex justify-between align-center overflow-hidden" style={{ pointerEvents: deleteDisabled ? 'none' : 'auto' }}>
                  <div className="flex gap-4">
                    {/* <Image src={<InsertDriveFileIcon />} alt="" /> */}
                    <span
                      className={
                        'my-auto select-none w-11/12 text-[#344054] font-medium text-sm'
                      }
                    >
                      <p className='truncate w-[6rem]'>{item.name}</p>
                    </span>
                  </div>
                  <span
                    onClick={() => {
                      removeDocument(index);
                    }}
                    className="cursor-pointer my-auto"
                  >
                    <DeleteOutlineOutlinedIcon className="w-5" />
                  </span>
                </div>
                {/* {item.isPasswordAdded === true ? (
                  <div className="mt-3">
                    <label className="formikLabel">Password</label>
                    <div className="flex justify-between gap-2 h-[4rem]">
                      <a
                        className=""
                        onClick={() => {
                          const files = [...fieldProps?.value];
                          files[index].isPasswordAdded = false;
                          formik?.setFieldValue(name, files);
                        }}
                      >
                        <div className="rounded-full bg-[#F0F2F4] mt-3">
                          <Image src={''} alt="Trash Icon" />
                        </div>
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-[#344054] ml-[3.2rem] mt-5">
                    Do the file contain password?{' '}
                    <a
                      className="text-[#405cd2] hover:text-[#405cd2] underline cursor-pointer"
                      onClick={() => {
                        const files = [...fieldProps?.value];
                        files[index].isPasswordAdded = true;
                        formik?.setFieldValue(name, files);
                      }}
                    >
                      Add Here
                    </a>
                  </div>
                )} */}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default DraggerWithPreSignedURLWrapper;