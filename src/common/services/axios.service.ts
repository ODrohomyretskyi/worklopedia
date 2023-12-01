import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

const httpService = new HttpService();

export const makeReq = async <T>(
  url: string,
  config: AxiosRequestConfig,
): Promise<T> => {
  const response: AxiosResponse<T> = await httpService.axiosRef.get(
    url,
    config,
  );

  return response.data;
};
