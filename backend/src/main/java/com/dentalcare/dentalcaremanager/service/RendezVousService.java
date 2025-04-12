package com.dentalcare.dentalcaremanager.service;

import com.dentalcare.dentalcaremanager.dto.RendezVousRequest;
import com.dentalcare.dentalcaremanager.dto.RendezVousResponse;
import com.dentalcare.dentalcaremanager.rdv.StatusRdv;


import java.time.LocalDate;
import java.util.List;

public interface RendezVousService {

    RendezVousResponse create(RendezVousRequest request);
    List<RendezVousResponse> getAll();
    List<RendezVousResponse> getByDate(LocalDate date);

    List<RendezVousResponse> getByMonth(int year, int month);

    List<RendezVousResponse> getByUserId(Integer userId);
    Integer getUserIdByEmail(String email);
    RendezVousResponse getById(Integer id);

    void deleteById(Integer id);
    List<RendezVousResponse> findByStatus(StatusRdv status);
    void confirmRendezVous(Integer id);
    void rejectRendezVous(Integer id);
    List<RendezVousResponse> findAllByMonth(LocalDate dateInMonth);


}
