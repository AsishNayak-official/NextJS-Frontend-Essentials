import { useAppSelector } from '@/app/hooks/redux.hooks';
import { ApplicantFilter } from '@/app/types/interfaces';
import Button from '@/input-components/Button';
import Select from '@/input-components/Select';
import { ROLES, STATUS, STATUS_VIEW } from '@/utils/constants';
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import React from 'react';


interface IFilterComponent {
    filterOptions: ApplicantFilter,
    handleFilterChange: (key: string, value: any) => void,
    handleFilter: () => void;
}

const FilterComponent: React.FC<IFilterComponent> = ({ filterOptions, handleFilter, handleFilterChange }) => {
    const userRole = useAppSelector(state => state.auth.role);

    return (
        <div>
            <div className="flex-row  w-full  bg-#CBCBCB">
                <div className="flex border-none rounded-xl h-auto ">
                    <div className="flex-1  p-3 ">
                        <div className="justify-center items-center flex gap-5">
                            {
                                <Select
                                    variant="outlined"
                                    label="Status"
                                    name='status'
                                    value={!filterOptions.status ? '--' : filterOptions.status}
                                    onChange={(e: any) => handleFilterChange('status', e.target.value === '--' ? '' : e.target.value)}
                                    optionsWithKeys={{ '--': 'All', ...STATUS_VIEW }}
                                />
                            }
                            <Select
                                variant="outlined"
                                label="Min. Experience"
                                name='minimumExperience'
                                value={filterOptions.minimumExperience == null ? 'All' : filterOptions.minimumExperience}
                                onChange={(e: any) => handleFilterChange('minimumExperience', e.target.value == 'All' ? null : e.target.value)}
                                options={['All', ...Array.from({ length: 20 }, (v, i) => i.toString())]}
                            />
                            <Select
                                variant="outlined"
                                label="Max. Experience"
                                name='maximumExperience'
                                value={filterOptions.maximumExperience == null ? 'All' : filterOptions.maximumExperience}
                                onChange={(e: any) => handleFilterChange('maximumExperience', e.target.value == 'All' ? null : e.target.value)}
                                options={['All', ...Array.from({ length: 20 }, (v, i) => i.toString())]}
                            />
                            <Select
                                variant="outlined"
                                label="Not. period"
                                name='noticePeriod'
                                value={filterOptions.noticePeriod == null ? 'All' : filterOptions.noticePeriod}
                                onChange={(e: any) => handleFilterChange('noticePeriod', e.target.value == 'All' ? null : e.target.value)}
                                options={['All', ...Array.from({ length: 20 }, (v, i) => i.toString())]}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FilterComponent