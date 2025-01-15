/**
 * Service module for handling all timesheet-related operations.
 * This module contains various functions for fetching, saving, and managing timesheets.
 */

import { AllTimesheetResponse, FetchProjectsResponse, FetchTaskCategoriesResponse, PostResponses, RejectedTimesheetResponse, TimesheetDataTable, TimesheetsCountResponse, WeeksOverViewResponse } from "@/interfaces/timesheets/timesheets";
import { DatePickerData } from "@/themes/components/date-picker/date-picker";
import { normalizedDateString } from "@/utils/date-formatter-util/date-formatter";
import http from "@/utils/http";

export default function UseAllTimesheetsServices() {

    /**
     * Fetches all timesheets within a given date range.
     * @param startRawDate - The raw start date as a string.
     * @param endRawDate - The raw end date as a string.
     * @returns A promise that resolves to the response containing all timesheets.
     */
    const fetchAllTimesheets = async (
        startRawDate: string,
        endRawDate: string
    ): Promise<AllTimesheetResponse> => {
        try {
            const startDate = normalizedDateString(startRawDate);
            const endDate = normalizedDateString(endRawDate);
            const props: JSON = <JSON>(<unknown>{ startDate, endDate });
            const { body } = await http().post("/api/timesheet/get-weekly-timesheets", props);
            return {
                status: body.status,
                data: body.data || null,
                message: body.message,
                errors: body.errors || null,
                weekDates: body.weekDates
            };
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    /**
     * Fetches the count of timesheets by their statuses.
     * @returns A promise that resolves to the response containing timesheets count.
     */
    const fetchTimesheetsCounts = async (): Promise<TimesheetsCountResponse> => {
        try {
            const { body } = await http().post("/api/timesheet/get-timesheet-status");
            return {
                status: body.status,
                message: body.message,
                errors: body.errors || null,
                data: body.data || null
            };
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    /**
     * Fetches weeks overview for past due timesheets.
     * @returns A promise that resolves to the response containing past due weeks overview.
     */
    const fetchPastDueWeeks = async (): Promise<WeeksOverViewResponse> => {
        try {
            const status = 'saved';
            const props: JSON = <JSON>(<unknown>{ status });
            const { body } = await http().post("/api/timesheet/pastdue", props);

            return {
                status: body.status,
                data: body.data || null,
                message: body.message,
                errors: body.errors || null,
            };
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    /**
     * Fetches all past due timesheets within a given date range.
     * @param startDate - The start date as a string.
     * @param endDate - The end date as a string.
     * @returns A promise that resolves to the response containing past due timesheets.
     */     
    const fetchPastDueTimesheets = async (startDate: string, endDate: string): Promise<AllTimesheetResponse> => {
        try {
            const props: JSON = <JSON>(<unknown>{ startDate, endDate });
            const { body } = await http().post("/api/timesheet/getduetimesheet", props);
            return {
                status: body.status,
                data: body.data || null,
                message: body.message,
                weekDates: body.weekDates
            };
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    /**
     * Fetches weeks overview for approved timesheets.
     * @returns A promise that resolves to the response containing approved weeks overview.
     */
    const fetchApprovedWeeks = async (): Promise<WeeksOverViewResponse> => {
        try {
            const status = 'accepted';
            const props: JSON = <JSON>(<unknown>{ status });
            const { body } = await http().post("/api/timesheet/pastdue", props);
            return {
                status: body.status,
                data: body.data || null,
                message: body.message,
                errors: body.errors || null,
            };
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    /**
     * Fetches approved timesheets within a given date range.
     * @param startDate - The start date as a string.
     * @param endDate - The end date as a string.
     * @returns A promise that resolves to the response containing approved timesheets.
     */
    const fetchApprovedTimesheets = async (startDate: string, endDate: string): Promise<AllTimesheetResponse> => {
        try {
            const status = "accepted";
            const props: JSON = <JSON>(<unknown>{ startDate, endDate, status });
            const { body } = await http().post("/api/timesheet/getduetimesheet", props);
            return {
                status: body.status,
                data: body.data || null,
                message: body.message,
                weekDates: body.weekDates
            };
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    /**
     * Fetches weeks overview for rejected timesheets.
     * @returns A promise that resolves to the response containing rejected weeks overview.
     */
    const fetchRejectedWeeks = async (): Promise<WeeksOverViewResponse> => {
        try {
            const status = 'rejected';
            const props: JSON = <JSON>(<unknown>{ status });
            const { body } = await http().post("/api/timesheet/pastdue", props);
            return {
                status: body.status,
                data: body.data || null,
                message: body.message,
                errors: body.errors || null,
            };
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    /**
     * Saves all provided timesheets.
     * @param timesheet - An array of timesheet data to save.
     * @returns A promise that resolves to the response of the save operation.
     */
    const saveAllTimesheets = async (timesheet: TimesheetDataTable[]): Promise<PostResponses> => {
        try {
            const dates: string[] = [];
            
            const dateFunc = () => {
                timesheet.forEach((task) => {
                    task.data_sheet.forEach((date) => {
                        if (!date.is_disable) {
                            dates.push(date.date); // Add non-disabled dates to the array
                        }
                    });
                });
            };

            dateFunc();
            let timesheets = timesheet.map((task) => {
                return {
                    ...task,
                    passedDate: dates[0],
                    timesheetId: task.timesheet_id ?? null, // Use null if timesheet_id is not present
                    data_sheet:task.data_sheet.filter((day_data)=>day_data.is_disable === false)
                };
            });

            timesheets = timesheets.filter((timesheet)=>timesheet.status !== "accepted").map((timesheet)=>{
                return {
                    ...timesheet,
                    passedDate: dates[0],
                    timesheetId: timesheet.timesheet_id ?? null, // Use null if timesheet_id is not present
                    data_sheet: timesheet.data_sheet.filter((day_data) => day_data.is_disable === false),
                  };
            })

            const props: JSON = <JSON>(<unknown>{ timesheets });
            const { body } = await http().post("/api/timesheet/save-timesheets", props);


            return {
                status: body.status,
                message: body.message,
                data: body.data
            };
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    /**
     * Fetches rejected timesheets within a given date range.
     * @param startDate - The start date as a string.
     * @param endDate - The end date as a string.
     * @returns A promise that resolves to the response containing rejected timesheets.
     */
    const fetchRejectedTimesheets = async (startDate: string, endDate: string): Promise<RejectedTimesheetResponse> => {
        try {
            const status = "rejected";
            const props: JSON = <JSON>(<unknown>{ startDate, endDate, status });
            const { body } = await http().post("/api/timesheet/getduetimesheet", props);
            return {
                status: body.status,
                data: body.data || null,
                message: body.message,
                weekDates: body.weekDates,
                notes: body.notes
            };
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    /**
     * Fetches task categories for a specific project.
     * @param projectId - The ID of the project.
     * @returns A promise that resolves to the response containing task categories.
     */
    const fetchTaskCategories = async (projectId: string): Promise<FetchTaskCategoriesResponse> => {
        try {
            const props: JSON = <JSON>(<unknown>{ projectId });
            const { body } = await http().post('/api/project/get-categories', props);
            return {
                status: body.status,
                data: body.data || null,
                message: body.message,
                errors: body.errors || null,
            };
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    /**
     * Fetches projects available to add a new timesheet.
     * @returns A promise that resolves to the response containing projects list.
     */
    const fetchProjectsToAddNewTimesheet = async (): Promise<FetchProjectsResponse> => {
        try {
            const { body } = await http().post('/api/project/list-projects-by-user');
            return {
                status: body.status,
                data: body.data || null,
                message: body.message,
                errors: body.errors || null,
            };
        } catch (error) {
            console.error(error);
            throw error;
        }
    };


    /**
     * Submit all provided timesheets.
     * @param timesheet - An array of timesheet data to save.
     * @returns A promise that resolves to the response of the save operation.
     */
    const submitAllTimesheets = async (timesheet: TimesheetDataTable[]): Promise<PostResponses> => {
        try {
            const timesheets = timesheet.map((task) => task.timesheet_id);
            const props: JSON = <JSON>(<unknown>{ timesheets });
            const { body } = await http().post('/api/timesheet/submit-timesheets', props);
            return body;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    /**
     * Saves all provided timesheets.
     * @param timesheetId - An array of timesheet data to save.
     * @returns A promise that resolves to the response of the save operation.
     */
    const deleteTimesheet = async (timesheetId: string): Promise<PostResponses> => {
        try {
            const props: JSON = <JSON>(<unknown>{ timesheetId });
            const { body } = await http().post('/api/timesheet/delete-timesheet', props);
            return body;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async function fetchWeeks(
        setWeeks: (weeks: DatePickerData[]) => void,
        keyDate?: string
    ): Promise<void> {
        try {
            const date = keyDate ? new Date(keyDate) : new Date().toISOString().split('T')[0];
            const props: JSON = <JSON>(<unknown>{ date });
            const { body } = await http().post(
                "/api/timesheet/getdates",
                props);
    
            setWeeks(body.data);
        } catch (error) {
            console.error(error)
        }
    }
    
    


    return {
        fetchAllTimesheets,
        fetchApprovedWeeks,
        fetchTimesheetsCounts,
        fetchPastDueWeeks,
        saveAllTimesheets,
        fetchPastDueTimesheets,
        fetchApprovedTimesheets,
        fetchRejectedWeeks,
        fetchRejectedTimesheets,
        fetchTaskCategories,
        fetchProjectsToAddNewTimesheet,
        submitAllTimesheets,
        deleteTimesheet,
        fetchWeeks
    };
}
