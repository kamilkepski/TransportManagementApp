export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
};

export const filterRoutePoints = (locations, minDistance = 0.05) => {
  let filteredPoints = [];
  let lastPoint = null;

  locations.forEach((point) => {
    if (lastPoint === null) {
      filteredPoints.push(point);
      lastPoint = point;
    } else {
      const distance = calculateDistance(
        lastPoint.latitude,
        lastPoint.longitude,
        point.latitude,
        point.longitude
      );

      if (distance >= minDistance) {
        filteredPoints.push(point);
        lastPoint = point;
      }
    }
  });

  return filteredPoints;
};

export const simplifyRoute = (points, tolerance) => {
  const recursiveSimplify = (points, start, end, tolerance, result) => {
    let maxDistance = 0;
    let index = -1;

    for (let i = start + 1; i < end; i++) {
      const distance = pointToLineDistance(
        points[i],
        points[start],
        points[end]
      );
      if (distance > maxDistance) {
        maxDistance = distance;
        index = i;
      }
    }

    if (maxDistance > tolerance) {
      recursiveSimplify(points, start, index, tolerance, result);
      result.push(points[index]);
      recursiveSimplify(points, index, end, tolerance, result);
    }
  };

  const pointToLineDistance = (point, start, end) => {
    const x1 = start[0],
      y1 = start[1],
      x2 = end[0],
      y2 = end[1],
      x0 = point[0],
      y0 = point[1];
    const numerator = Math.abs(
      (y2 - y1) * x0 - (x2 - x1) * y0 + x2 * y1 - y2 * x1
    );
    const denominator = Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2));
    return numerator / denominator;
  };

  const result = [points[0]];
  recursiveSimplify(points, 0, points.length - 1, tolerance, result);
  result.push(points[points.length - 1]);

  return result;
};
