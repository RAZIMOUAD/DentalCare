package com.dentalcare.dentalcaremanager.service;

import com.dentalcare.dentalcaremanager.dto.RendezVousRequest;
import com.dentalcare.dentalcaremanager.dto.RendezVousResponse;


import java.time.LocalDate;
import java.util.List;

public interface RendezVousService {

    RendezVousResponse create(RendezVousRequest request);
    List<RendezVousResponse> getAll();
    List<RendezVousResponse> getByDate(LocalDate date);
    List<RendezVousResponse> getByUserId(Integer userId);
    Integer getUserIdByEmail(String email);
    RendezVousResponse getById(Integer id);

    void deleteById(Integer id);
}
