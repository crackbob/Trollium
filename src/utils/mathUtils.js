export default {
    normalizeVector(vector) {
        const magnitudeSquared = vector[0] * vector[0] + vector[1] * vector[1] + vector[2] * vector[2];
        if (magnitudeSquared > 0) {
            const reciprocalMagnitude = 1 / Math.sqrt(magnitudeSquared);
            return [vector[0] * reciprocalMagnitude, vector[1] * reciprocalMagnitude, vector[2] * reciprocalMagnitude];
        }
        return vector;
    },

    distanceBetween(point1, point2) {
        const xDifference = point2[0] - point1[0];
        const yDifference = point2[1] - point1[1];
        const zDifference = point2[2] - point1[2];
        return xDifference * xDifference + yDifference * yDifference + zDifference * zDifference;
    },

    distanceBetweenSqrt(pointA, pointB) {
        return Math.sqrt(this.distanceBetween(pointA, pointB));
    },
};