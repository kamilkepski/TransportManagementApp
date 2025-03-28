package me.kepski.transport.controller;

import me.kepski.transport.entity.Repair;
import me.kepski.transport.entity.Vehicle;
import me.kepski.transport.service.PdfService;
import me.kepski.transport.service.RepairService;
import me.kepski.transport.service.VehicleService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final PdfService pdfService;
    private final VehicleService vehicleService;
    private final RepairService repairService;

    public ReportController(PdfService pdfService, VehicleService vehicleService, RepairService repairService) {
        this.pdfService = pdfService;
        this.vehicleService = vehicleService;
        this.repairService = repairService;
    }

    @GetMapping(value = "/order", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> generateReport(@RequestParam Long id) throws IOException {
        byte[] pdf = pdfService.generatePdf(id);

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=zlec.pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    @GetMapping(value = "/inspections", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> generateInspectionsReport() throws IOException {
        List<Vehicle> vehicleList = vehicleService.getAllVehicles();
        byte[] pdf = pdfService.generateInspectionsPdf(vehicleList);

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=insp.pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    @GetMapping(value = "/repairs", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> generateRepairsReport() throws IOException {
        List<Repair> repairsList = repairService.getAllRepairs();
        byte[] pdf = pdfService.generateRepairsPdf(repairsList);

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=naprawy.pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}
