import { Controller, Get, Res } from '@nestjs/common';
import { CsvExportService } from './csv-export.service';
import { Response } from 'express';

@Controller('csv-export')
export class CsvExportController {
  constructor(private readonly csvExportService: CsvExportService) {}

  @Get('current-month')
  async exportCsvForCurrentMonth(@Res() res: Response) {
    await this.csvExportService.exportCsvForCurrentMonth();

    // Set response headers for CSV download
    res.setHeader(
      'Content-disposition',
      'attachment; filename=conges_acceptes.csv',
    );
    res.setHeader('Content-Type', 'text/csv');

    // Return the CSV file
    res.sendFile('conges_acceptes.csv', { root: './' }); // Specify the root directory
  }
}
