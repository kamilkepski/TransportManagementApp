package me.kepski.transport.service.implementation;

import me.kepski.transport.dto.AnnouncementRequest;
import me.kepski.transport.entity.Announcement;
import me.kepski.transport.repository.AnnouncementRepository;
import me.kepski.transport.service.AnnouncementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AnnouncementServiceImpl implements AnnouncementService {

    private final AnnouncementRepository announcementRepository;

    @Autowired
    public AnnouncementServiceImpl(AnnouncementRepository announcementRepository) {
        this.announcementRepository = announcementRepository;
    }

    @Override
    public List<Announcement> getAllAnnouncements() {
        return announcementRepository.findAll();
    }

    @Override
    public Announcement getAnnouncementById(Long id) {
        return announcementRepository.findById(id).orElse(null);
    }

    @Override
    public Announcement createAnnouncement(AnnouncementRequest announcementRequest) {
        Announcement announcement = new Announcement();
        announcement.setTitle(announcementRequest.getTitle());
        announcement.setDescription(announcementRequest.getDescription());
        return announcementRepository.save(announcement);
    }

    @Override
    public void deleteAnnouncement(Long id) {
        Announcement announcement = getAnnouncementById(id);
        announcementRepository.delete(announcement);
    }

    @Override
    public Page<Announcement> getAnnouncementsPage(Pageable pageable) {
        return announcementRepository.findAll(pageable);
    }
}
