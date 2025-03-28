package me.kepski.transport.service;

import me.kepski.transport.dto.AnnouncementRequest;
import me.kepski.transport.entity.Announcement;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface AnnouncementService {

    List<Announcement> getAllAnnouncements();
    Announcement getAnnouncementById(Long id);
    Announcement createAnnouncement(AnnouncementRequest announcementRequest);
    void deleteAnnouncement(Long id);
    Page<Announcement> getAnnouncementsPage(Pageable pageable);
}
