import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { appointments } from '../services/api';
import { AppointmentState, Appointment } from '../types';

const initialState: AppointmentState = {
  active: [],
  history: [],
  isLoading: false,
  error: null,
};

export const fetchActiveAppointments = createAsyncThunk(
  'appointments/fetchActive',
  async () => {
    const response = await appointments.getActive();
    return response.data;
  }
);

export const fetchAppointmentHistory = createAsyncThunk(
  'appointments/fetchHistory',
  async () => {
    const response = await appointments.getHistory();
    return response.data;
  }
);

export const createAppointment = createAsyncThunk(
  'appointments/create',
  async (appointmentData: {
    barberId: number;
    serviceId: number;
    date: string;
    time: string;
  }) => {
    const response = await appointments.create(appointmentData);
    return response.data;
  }
);

export const cancelAppointment = createAsyncThunk(
  'appointments/cancel',
  async (id: number) => {
    await appointments.cancel(id);
    return id;
  }
);

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchActiveAppointments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchActiveAppointments.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.active = payload;
      })
      .addCase(fetchActiveAppointments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch active appointments';
      })
      .addCase(fetchAppointmentHistory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAppointmentHistory.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.history = payload;
      })
      .addCase(fetchAppointmentHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch appointment history';
      })
      .addCase(createAppointment.fulfilled, (state, { payload }) => {
        state.active.push(payload);
      })
      .addCase(cancelAppointment.fulfilled, (state, { payload: id }) => {
        state.active = state.active.filter((appointment) => appointment.id !== id);
      });
  },
});

export default appointmentSlice.reducer; 