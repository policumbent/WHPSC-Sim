export class BleCharacteristicParser {
    fields;
    mask_size: number;

    getData(dataView) {
        let offset = 0;
        let mask;
        if(this.mask_size === 16) {
            mask = dataView.getUint16(0, true);
            offset += 2;
        } else {
            mask = dataView.getUint8(0);
            offset += 1;
        }

        let fieldArrangement = [];

        // Contains required fields
        if(this.fields[0][0] === 0) {
            for(let fDesc of this.fields[0][1]) {
                fieldArrangement.push(fDesc);
            }
        }

        for(let [flag, fieldDescriptions] of this.fields) {
            if(mask & flag) {
                for(let fDesc of fieldDescriptions) {
                    fieldArrangement.push(fDesc);
                }
            }
        }

        let data = {};
        for(let field of fieldArrangement) {
            var [[accessor, fieldSize, endianness], fieldName] = field;
            let value;
            if(endianness) {
                value = dataView[accessor](offset, endianness);
            } else {
                value = dataView[accessor](offset);
            }

            data[fieldName] = value;
            offset += fieldSize;
        }

        return data;
    }
}
