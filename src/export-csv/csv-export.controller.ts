import { Controller, Get, Res } from '@nestjs/common';
import { CsvExportService } from './csv-export.service';
import { Response } from 'express';
import { Public } from '../users/auth/public.decorator';

@Controller('csv-export')
export class CsvExportController {
  constructor(private readonly csvExportService: CsvExportService) {}

  @Public()
  @Get('current-month')
  async exportCsvForCurrentMonth(@Res() res: Response): Promise<void> {
    await this.csvExportService.exportCsvForCurrentMonth();

    res.setHeader(
      'Content-disposition',
      'attachment; filename=conges_acceptes.csv',
    );
    res.setHeader('Content-Type', 'text/csv');
    res.sendFile('conges_acceptes.csv', { root: './' });
  }
}
