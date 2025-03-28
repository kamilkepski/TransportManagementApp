package me.kepski.transport.dto;

import me.kepski.transport.entity.Coordinate;

import java.util.List;

public class RouteRequestDTO {
    private List<Coordinate> coordinates;

    public RouteRequestDTO() {
    }

    public List<Coordinate> getCoordinates() {
        return coordinates;
    }

    public void setCoordinates(List<Coordinate> coordinates) {
        this.coordinates = coordinates;
    }
}
