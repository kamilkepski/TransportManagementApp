package me.kepski.transport.service;

import me.kepski.transport.entity.*;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDFont;
import org.apache.pdfbox.pdmodel.font.PDType0Font;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class PdfService {

    private final OrderService orderService;

    public PdfService(OrderService orderService) {
        this.orderService = orderService;
    }

    public byte[] generatePdf(Long id) throws IOException {
        Order order = orderService.getOrderById(id);

        try (PDDocument document = new PDDocument();
             ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {

            PDFont fontRegular = PDType0Font.load(document, new File("src/main/resources/fonts/dejavusans.ttf"));
            int marginLeft = 50;
            int marginBottom = 50;
            int startY = 750;
            int lineSpacing = 15;
            int currentY = startY;

            PDPage page = new PDPage();
            document.addPage(page);

            try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
                contentStream.setFont(fontRegular, 12);

                LocalDateTime now = LocalDateTime.now();
                DateTimeFormatter formatter2 = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
                String formattedDateTime = now.format(formatter2);

                contentStream.beginText();
                contentStream.newLineAtOffset(marginLeft, currentY);
                contentStream.setFont(fontRegular, 12);
                contentStream.showText("Data wygenerowania: " + formattedDateTime);
                contentStream.endText();
                currentY -= 2 * lineSpacing;

                contentStream.beginText();
                contentStream.newLineAtOffset(marginLeft, currentY);
                contentStream.setFont(fontRegular, 14);
                contentStream.showText("Raport z realizacji zlecenia " + order.getId());
                contentStream.endText();
                currentY -= 2 * lineSpacing;

                contentStream.beginText();
                contentStream.newLineAtOffset(marginLeft, currentY);
                contentStream.setFont(fontRegular, 12);
                if (order.getTitle() != null && !order.getTitle().isEmpty()) {
                    contentStream.showText("Tytuł: " + order.getTitle());
                    contentStream.newLineAtOffset(0, -lineSpacing);
                }
                contentStream.showText("Zamawiający: " + order.getName());
                contentStream.newLineAtOffset(0, -lineSpacing);
                contentStream.showText("Telefon: " + order.getPhoneNumber());
                contentStream.newLineAtOffset(0, -lineSpacing);
                contentStream.showText("Status: " + order.getStatus());
                contentStream.endText();
                currentY -= 5 * lineSpacing;

                contentStream.beginText();
                contentStream.newLineAtOffset(marginLeft, currentY);
                contentStream.setFont(fontRegular, 13);
                contentStream.showText("Przypisane pojazdy i kierowcy:");
                contentStream.endText();
                currentY -= 2 * lineSpacing;

                for (OrderVehicleAssignment assignment : order.getVehicleAssignments()) {
                    List<DriverAssignment> activeAssignments = assignment.getDriverAssignments()
                            .stream()
                            .filter(DriverAssignment::isActive)
                            .toList();

                    if (activeAssignments.isEmpty()) {
                        continue;
                    }

                    if (currentY < marginBottom) {
                        currentY = addNewPage(document, contentStream, fontRegular, marginLeft, startY);
                    }

                    Vehicle vehicle = assignment.getVehicle();
                    contentStream.beginText();
                    contentStream.newLineAtOffset(marginLeft, currentY);
                    contentStream.showText("- Pojazd: " + vehicle.getName() + " " + vehicle.getModel() + ", Rejestracja: " + vehicle.getRegistrationNumber());
                    contentStream.endText();
                    currentY -= lineSpacing;

                    for (DriverAssignment driverAssignment : activeAssignments) {
                        if (currentY < marginBottom) {
                            currentY = addNewPage(document, contentStream, fontRegular, marginLeft, startY);
                        }

                        Driver driver = driverAssignment.getDriver();

                        contentStream.beginText();
                        contentStream.newLineAtOffset(marginLeft + 20, currentY);
                        contentStream.showText("Kierowca: " + (driver != null ? driver.getFirstName() + " " + driver.getLastName() + " ID: " + driver.getId() : "Brak danych"));
                        contentStream.endText();
                        currentY -= lineSpacing;

                        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

                        Calendar startCal = Calendar.getInstance();
                        Calendar endCal = Calendar.getInstance();

                        if (driverAssignment.getStartTime() != null) {
                            startCal.setTime(driverAssignment.getStartTime());
                            startCal.set(Calendar.MILLISECOND, 0);
                        }

                        if (driverAssignment.getEndTime() != null) {
                            endCal.setTime(driverAssignment.getEndTime());
                            endCal.set(Calendar.MILLISECOND, 0);
                        }

                        String startTimeFormatted = (driverAssignment.getStartTime() != null) ?
                                formatter.format(startCal.getTime()) : "null";
                        String endTimeFormatted = (driverAssignment.getEndTime() != null) ?
                                formatter.format(endCal.getTime()) : "null";

                        String workTime = "null";
                        if (driverAssignment.getStartTime() != null && driverAssignment.getEndTime() != null) {
                            long diffInSeconds = (endCal.getTimeInMillis() - startCal.getTimeInMillis()) / 1000;

                            long hours = diffInSeconds / 3600;
                            long remainingMinutes = (diffInSeconds % 3600) / 60;
                            long remainingSeconds = diffInSeconds % 60;

                            workTime = String.format("%02d:%02d:%02d", hours, remainingMinutes, remainingSeconds);
                        }

                        contentStream.beginText();
                        contentStream.newLineAtOffset(marginLeft + 40, currentY);
                        contentStream.showText("Czas pracy: " + startTimeFormatted + " - " + endTimeFormatted + " (" + workTime + ")");
                        contentStream.endText();
                        currentY -= lineSpacing;

                        contentStream.beginText();
                        contentStream.newLineAtOffset(marginLeft + 40, currentY);
                        contentStream.showText("Przebieg: " + driverAssignment.getStartMileage() + " km -> " + driverAssignment.getEndMileage() + " km");
                        contentStream.endText();
                        currentY -= lineSpacing;

                        contentStream.beginText();
                        contentStream.newLineAtOffset(marginLeft + 40, currentY);
                        contentStream.showText("Paliwo: " +
                                (driverAssignment.getStartFuelLevel() != null ? driverAssignment.getStartFuelLevel() : "null") + " -> " +
                                (driverAssignment.getEndFuelLevel() != null ? driverAssignment.getEndFuelLevel() : "null"));
                        contentStream.endText();
                        currentY -= 2 * lineSpacing;
                    }
                }
            }

            document.save(outputStream);
            return outputStream.toByteArray();
        }
    }

    private int addNewPage(PDDocument document, PDPageContentStream contentStream, PDFont font, int marginLeft, int startY) throws IOException {
        contentStream.close();
        PDPage newPage = new PDPage();
        document.addPage(newPage);
        PDPageContentStream newContentStream = new PDPageContentStream(document, newPage);
        newContentStream.setFont(font, 12);
        newContentStream.beginText();
        newContentStream.newLineAtOffset(marginLeft, startY);
        return startY;
    }

    public byte[] generateInspectionsPdf(List<Vehicle> vehicles) throws IOException {
        try (PDDocument document = new PDDocument();
             ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {

            PDFont fontRegular = PDType0Font.load(document, new File("src/main/resources/fonts/dejavusans.ttf"));
            int marginLeft = 50;
            int marginBottom = 50;
            int startY = 750;
            int lineSpacing = 15;
            int currentY = startY;

            int registrationX = marginLeft;
            int modelX = marginLeft + 120;
            int yearX = marginLeft + 300;
            int inspectionX = marginLeft + 400;

            PDPage page = new PDPage();
            document.addPage(page);

            try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
                contentStream.setFont(fontRegular, 12);

                LocalDateTime now = LocalDateTime.now();
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
                String formattedDateTime = now.format(formatter);

                contentStream.beginText();
                contentStream.newLineAtOffset(marginLeft, currentY);
                contentStream.setFont(fontRegular, 12);
                contentStream.showText("Data wygenerowania: " + formattedDateTime);
                contentStream.endText();
                currentY -= 2 * lineSpacing;

                contentStream.beginText();
                contentStream.newLineAtOffset(marginLeft, currentY);
                contentStream.setFont(fontRegular, 14);
                contentStream.showText("Przeglądy techniczne pojazdów");
                contentStream.endText();
                currentY -= 2 * lineSpacing;

                contentStream.beginText();
                contentStream.newLineAtOffset(registrationX, currentY);
                contentStream.setFont(fontRegular, 12);
                contentStream.showText("Nr rej.");
                contentStream.endText();

                contentStream.beginText();
                contentStream.newLineAtOffset(modelX, currentY);
                contentStream.showText("Model");
                contentStream.endText();

                contentStream.beginText();
                contentStream.newLineAtOffset(yearX, currentY);
                contentStream.showText("Rok prod.");
                contentStream.endText();

                contentStream.beginText();
                contentStream.newLineAtOffset(inspectionX, currentY);
                contentStream.showText("Przegląd do");
                contentStream.endText();

                currentY -= lineSpacing;

                contentStream.beginText();
                contentStream.newLineAtOffset(marginLeft, currentY);
                contentStream.showText("-------------------------------------------------------------------------" +
                        "-------------------------------------------");
                contentStream.endText();
                currentY -= lineSpacing;

                SimpleDateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd");

                List<Vehicle> sortedVehicles = vehicles.stream()
                        .sorted(Comparator.comparing(Vehicle::getTechnicalInspection, Comparator.nullsLast(Date::compareTo)))
                        .toList();

                for (Vehicle vehicle : sortedVehicles) {
                    if (currentY < marginBottom) {
                        currentY = addNewPage(document, contentStream, fontRegular, marginLeft, startY);
                    }

                    contentStream.beginText();
                    contentStream.newLineAtOffset(registrationX, currentY);
                    contentStream.showText(vehicle.getRegistrationNumber());
                    contentStream.endText();

                    contentStream.beginText();
                    contentStream.newLineAtOffset(modelX, currentY);
                    contentStream.showText(vehicle.getModel());
                    contentStream.endText();

                    contentStream.beginText();
                    contentStream.newLineAtOffset(yearX, currentY);
                    contentStream.showText(vehicle.getProductionYear().toString());
                    contentStream.endText();

                    contentStream.beginText();
                    contentStream.newLineAtOffset(inspectionX, currentY);
                    contentStream.showText(
                            vehicle.getTechnicalInspection() != null ?
                                    dateFormatter.format(vehicle.getTechnicalInspection()) :
                                    "Brak danych"
                    );
                    contentStream.endText();

                    currentY -= lineSpacing;
                }
            }

            document.save(outputStream);
            return outputStream.toByteArray();
        }
    }

    public byte[] generateRepairsPdf(List<Repair> repairs) throws IOException {
        try (PDDocument document = new PDDocument();
             ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {

            PDFont fontRegular = PDType0Font.load(document, new File("src/main/resources/fonts/dejavusans.ttf"));
            int marginLeft = 50;
            int marginBottom = 50;
            int startY = 750;
            int lineSpacing = 15;
            int descriptionSpacing = 10;
            int currentY = startY;

            int registrationX = marginLeft;
            int titleX = marginLeft + 120;
            int descriptionX = marginLeft;


            PDPage page = new PDPage();
            document.addPage(page);
            PDPageContentStream contentStream = new PDPageContentStream(document, page);

            float normalFontSize = 12;
            float headerFontSize = 14;
            contentStream.setFont(fontRegular, normalFontSize);

            LocalDateTime now = LocalDateTime.now();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
            String formattedDateTime = now.format(formatter);

            contentStream.beginText();
            contentStream.newLineAtOffset(marginLeft, currentY);
            contentStream.setFont(fontRegular, normalFontSize);
            contentStream.showText("Data wygenerowania: " + formattedDateTime);
            contentStream.endText();
            currentY -= 2 * lineSpacing;

            contentStream.beginText();
            contentStream.newLineAtOffset(marginLeft, currentY);
            contentStream.setFont(fontRegular, headerFontSize);
            contentStream.showText("Lista napraw pojazdów");
            contentStream.endText();
            currentY -= 2 * lineSpacing;

            contentStream.beginText();
            contentStream.newLineAtOffset(registrationX, currentY);
            contentStream.setFont(fontRegular, normalFontSize);
            contentStream.showText("Nr rej.");
            contentStream.endText();

            contentStream.beginText();
            contentStream.newLineAtOffset(titleX, currentY);
            contentStream.setFont(fontRegular, normalFontSize);
            contentStream.showText("Tytuł naprawy");
            contentStream.endText();

            currentY -= lineSpacing;

            contentStream.beginText();
            contentStream.newLineAtOffset(marginLeft, currentY);
            contentStream.setFont(fontRegular, normalFontSize);
            contentStream.showText("-------------------------------------------------------------------------" +
                    "-------------------------------------------");
            contentStream.endText();
            currentY -= lineSpacing;

            for (Repair repair : repairs) {
                if (currentY < marginBottom) {
                    currentY = addNewPage(document, contentStream, fontRegular, marginLeft, startY);
                    contentStream = new PDPageContentStream(document, document.getPage(document.getNumberOfPages() - 1));
                    contentStream.setFont(fontRegular, normalFontSize);
                }

                contentStream.beginText();
                contentStream.newLineAtOffset(registrationX, currentY);
                contentStream.setFont(fontRegular, normalFontSize);
                contentStream.showText(repair.getVehicle().getRegistrationNumber());
                contentStream.endText();

                contentStream.beginText();
                contentStream.newLineAtOffset(titleX, currentY);
                contentStream.setFont(fontRegular, normalFontSize);
                contentStream.showText(repair.getTitle());
                contentStream.endText();

                currentY -= lineSpacing;

                if (repair.getRepairDate() != null) {
                    String formattedDate = new SimpleDateFormat("yyyy-MM-dd").format(repair.getRepairDate());

                    contentStream.beginText();
                    contentStream.newLineAtOffset(registrationX, currentY);
                    contentStream.setFont(fontRegular, normalFontSize);
                    contentStream.showText("Data naprawy: " + formattedDate);
                    contentStream.endText();
                    currentY -= lineSpacing;
                }

                currentY -= descriptionSpacing;

                int textHeight = addWrappedText(contentStream, repair.getDescription(), descriptionX, currentY, fontRegular, normalFontSize, 500);
                currentY -= textHeight;

                currentY -= 2 * lineSpacing;
            }

            contentStream.close();

            document.save(outputStream);
            return outputStream.toByteArray();
        }
    }

    private int addWrappedText(PDPageContentStream contentStream, String text, float startX, float startY, PDFont font, float fontSize, float maxWidth) throws IOException {
        text = text.replace("\r\n", "\n").replace("\r", "\n");

        String[] lines = text.split("\n");
        int lineHeight = Math.round(fontSize + 5);
        float currentY = startY;
        int totalHeight = 0;

        for (String line : lines) {
            List<String> wrappedLines = wrapText(line, font, fontSize, maxWidth);
            for (String wrappedLine : wrappedLines) {
                contentStream.beginText();
                contentStream.setFont(font, fontSize);
                contentStream.newLineAtOffset(startX, currentY);
                contentStream.showText(wrappedLine);
                contentStream.endText();
                currentY -= lineHeight;
                totalHeight += lineHeight;
            }
        }

        return totalHeight;
    }

    private List<String> wrapText(String text, PDFont font, float fontSize, float maxWidth) throws IOException {
        List<String> lines = new ArrayList<>();
        String[] words = text.split(" ");
        StringBuilder currentLine = new StringBuilder();

        for (String word : words) {
            String potentialLine = currentLine.length() > 0
                    ? currentLine + " " + word
                    : word;

            float textWidth = font.getStringWidth(potentialLine) / 1000 * fontSize;

            if (textWidth > maxWidth) {
                if (currentLine.length() > 0) {
                    lines.add(currentLine.toString());
                    currentLine = new StringBuilder(word);
                } else {
                    lines.add(word);
                    currentLine = new StringBuilder();
                }
            } else {
                currentLine = new StringBuilder(potentialLine);
            }
        }

        if (currentLine.length() > 0) {
            lines.add(currentLine.toString());
        }

        return lines;
    }
}
