package me.kepski.transport.controller;

import jakarta.validation.Valid;
import me.kepski.transport.dto.AnnouncementRequest;
import me.kepski.transport.entity.Announcement;
import me.kepski.transport.service.AnnouncementService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/announcements")
public class AnnouncementController {

    private final AnnouncementService announcementService;

    public AnnouncementController(AnnouncementService announcementService) {
        this.announcementService = announcementService;
    }

    @GetMapping
    public Page<Announcement> getAnnouncements(Pageable pageable) {
        return announcementService.getAnnouncementsPage(pageable);
    }

    @PostMapping
    public ResponseEntity<Void> addAnnouncement(@Valid @RequestBody AnnouncementRequest announcementRequest) {
        Announcement announcement = announcementService.createAnnouncement(announcementRequest);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAnnouncement(@PathVariable Long id) {
        announcementService.deleteAnnouncement(id);
        return ResponseEntity.noContent().build();
    }
}
