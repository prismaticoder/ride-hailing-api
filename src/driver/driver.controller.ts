import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Request,
  ValidationPipe,
} from '@nestjs/common';
import { JsonResponse } from 'src/common/helpers/json-response.helper';
import { CreateDriverDto } from './create-driver.dto';
import { DriverService } from './driver.service';

@Controller('driver')
export class DriverController {
  constructor(private driverService: DriverService) {}

  @Get('')
  async index() {
    const result = await this.driverService.getAll();

    return JsonResponse.create('Drivers retrieved successfully.', result);
  }

  @Post('')
  async create(
    @Request() req,
    @Body(new ValidationPipe()) createDriverDto: CreateDriverDto,
  ) {
    const newDriver = await this.driverService.create(createDriverDto);

    return JsonResponse.create('Driver created successfully.', newDriver);
  }

  @Post(':id/suspend')
  @HttpCode(204)
  async suspend(@Param('id') id: string) {
    const driver = await this.driverService.getById(id);

    if (!driver) {
      throw new BadRequestException('Driver does not exist');
    }

    if (driver.suspendedAt) {
      throw new BadRequestException(
        'The selected driver has already been suspended.',
      );
    }

    await this.driverService.suspend(driver.id);

    return JsonResponse.create('Driver suspended successfully.');
  }

  @Delete(':id/suspend')
  @HttpCode(204)
  async unsuspend(@Param('id') id: string) {
    const driver = await this.driverService.getById(id);

    if (!driver) {
      throw new BadRequestException('Driver does not exist');
    }

    if (!driver.suspendedAt) {
      throw new BadRequestException(
        'The selected driver is not under suspension.',
      );
    }

    await this.driverService.unsuspend(driver.id);

    return JsonResponse.create('Suspension removed successfully.');
  }
}
