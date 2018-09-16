
import { Dimensions } from 'react-native';
import * as _ from 'lodash';

export default function addTouchDataToPath(pathData) {
    const { path } = pathData;
    const touchData = [];
    const { width, height } = Dimensions.get('window');

    path.data.map((coords, index, arr) => {
        const [a, b] = coords.split(',').map((val) => {
            return parseFloat(val);
        });

        const vectorLine = [];

        if (index > 0) {
            const [prevX, prevY] = arr[index - 1].split(',').map((val) => {
                return parseFloat(val);
            })
            const slope = (b - prevY) / (a - prevX);
            const angle = a < 0 ? Math.atan(slope) + Math.PI : Math.atan(slope);
            const increment = Math.abs(slope) === Infinity ? 0.5 * path.width : Math.cos(angle) * 0.5 * path.width;
            const angleVector = Math.abs(slope) === Infinity ? [0, 1] : [1, slope];

            for (var j = 0; Math.sign(a - prevX) > 0 ? j < a - prevX : j > a - prevX; j = j + Math.sign(a - prevX)) {
                var point = [a + j, b + j * slope];
                for (var i = 0; i <= Math.round(increment); i++) {
                    var vector = [angleVector[0] * i, angleVector[1] * i];
                    vectorLine.push([point[0] + vector[0], point[1] + vector[1]]);
                    vectorLine.push([point[0] - vector[0], point[1] - vector[1]]);
                }
            }

            const validPoints = vectorLine.filter((coords) => {
                return coords[0] >= 0 && coords[0] <= width && coords[1] >= 0 && coords[1] <= height;
            })

            touchData.push(...validPoints);
            return validPoints;
        }
        else {
            touchData.push([a, b]);
            return [a, b];
        }
    })
    const _touchData = _.uniqBy(touchData, (coords) => {
        return coords.toString();
    });
    const __touchData = _.sortBy(_touchData, [0, 1]);
   
    return {
        touchData: __touchData,
        rawTouchData: _touchData
    }
}
