function getVibrationIntensity(i,intenseLvlStart,intimacyStart,intenseLvlMidway,intimacyMidway,intimacyEnd, intenseLvlEnd, hrauselValues) {
    const patterns = [];

    if (i < 1) {
        patterns.push(intenseLvlStart * hrauselValues[0]);
    } 

    else if (i >=1 && i < 2) { 
        if (intimacyStart === 5){
            patterns.push((intenseLvlStart + 1)* hrauselValues[0]);

        } else {
            patterns.push(intenseLvlStart * hrauselValues[0]);
        }
    } 
    
    else if (i >= 2 && i < 3) {
        if (intimacyStart === 4 || intimacyStart === 6){
            patterns.push((intenseLvlStart + 2)* hrauselValues[0]);

        } else if (intimacyStart === 5 || intimacyStart === 7){
            patterns.push((intenseLvlStart + 1) * hrauselValues[0]);

        } else {
            patterns.push(intenseLvlStart * hrauselValues[0]);
        } 
    } 

    else if (i >= 3 && i < 4) {
        if (intimacyStart === 3){
            patterns.push((intenseLvlStart + 1) * hrauselValues[0]);

        } else if (intimacyStart === 6 || intimacyStart === 7){
            patterns.push((intenseLvlStart + 2) * hrauselValues[0]);

        } else {
            patterns.push(intenseLvlStart * hrauselValues[0]);
        } 
    } 

    else if (i >= 4 && i < 5) {
        if (intimacyStart === 3 || intimacyStart === 6){
            patterns.push((intenseLvlStart + 2) * hrauselValues[0]);

        } else if (intimacyStart === 7){
            patterns.push((intenseLvlStart + 3) * hrauselValues[0]);

        } else {
            patterns.push(intenseLvlStart * hrauselValues[0]);
        } 
    }

    else if (i >= 5 && i < 6) {
        if (intimacyStart === 3){
            patterns.push((intenseLvlStart + 3) * hrauselValues[0]);

        } else if (intimacyStart === 5){
            patterns.push((intenseLvlStart + 1) * hrauselValues[0]);

        }  else if (intimacyStart === 7){
            patterns.push((intenseLvlStart + 2) * hrauselValues[0]);

        } else {
            patterns.push(intenseLvlStart * hrauselValues[0]);
        }
    }

    else if (i >= 6 && i < 7) {
        if (intimacyStart === 3){
            patterns.push((intenseLvlStart + 2) * hrauselValues[0]);

        } else if (intimacyStart === 5 || intimacyStart === 7){
            patterns.push((intenseLvlStart + 1) * hrauselValues[0]);

        } else {
            patterns.push(intenseLvlStart * hrauselValues[0]);
        }
    }


    else if (i >= 7 && i < 8) {
        if (intimacyStart === 3){
            patterns.push((intenseLvlStart + 1) * hrauselValues[0]);

        } else if (intimacyStart === 4){
            patterns.push((intenseLvlStart + 3) * hrauselValues[0]);

        } else {
            patterns.push(intenseLvlStart * hrauselValues[0]);
        }
    }

    else if (i >= 8 && i < 9) {
        if (intimacyStart === 2){

            patterns.push((intenseLvlStart + 1 ) * hrauselValues[0]);

        } else if (intimacyStart === 6){
            patterns.push((intenseLvlStart + 2 ) * hrauselValues[0]);

        } else {
            patterns.push(intenseLvlStart * hrauselValues[0]);
        }
    }


    else if (i >= 9 && i < 11) {
        if (intimacyStart === 2 || intimacyStart === 6){

            patterns.push((intenseLvlStart + 2 ) * hrauselValues[0]);

        } else if (intimacyStart === 5){
            patterns.push((intenseLvlStart + 1 ) * hrauselValues[0]);

        } else {
            patterns.push(intenseLvlStart * hrauselValues[0]);
        }
    }


    else if (i >= 11 && i < 12) {
        if (intimacyStart === 2){

            patterns.push((intenseLvlStart + 2 ) * hrauselValues[0]);

        }  else {
            patterns.push(intenseLvlStart * hrauselValues[0]);
        }
    }

    else if (i >= 12 && i < 13) {
        if (intimacyStart === 2 || intimacyStart === 4){

            patterns.push((intenseLvlStart + 2 ) * hrauselValues[0]);

        } else if (intimacyStart === 7){
            patterns.push((intenseLvlStart + 1 ) * hrauselValues[0]);

        } else {
            patterns.push(intenseLvlStart * hrauselValues[0]);
        }
    }


    else if (i >= 13 && i < 14) {
        if (intimacyStart === 2 || intimacyStart === 7){

            patterns.push((intenseLvlStart + 2 ) * hrauselValues[0]);

        } else if (intimacyStart === 3 || intimacyStart === 5){
            patterns.push((intenseLvlStart + 1 ) * hrauselValues[0]);

        } else {
            patterns.push(intenseLvlStart * hrauselValues[0]);
        }
    }


    else if (i >= 14 && i < 15) {
        if (intimacyStart === 2 || intimacyStart === 3 || intimacyStart === 6){

            patterns.push((intenseLvlStart + 2 ) * hrauselValues[0]);

        } else if (intimacyStart === 5){
            patterns.push((intenseLvlStart + 1 ) * hrauselValues[0]);

        } else if (intimacyStart === 7){
            patterns.push((intenseLvlStart + 3 ) * hrauselValues[0]);

        } else {
            patterns.push(intenseLvlStart * hrauselValues[0]);
        }
    }


    else if (i >= 15 && i < 16) {
        if (intimacyStart === 2 || intimacyStart === 6 || intimacyStart === 7){

            patterns.push((intenseLvlStart + 2 ) * hrauselValues[0]);

        } else if (intimacyStart === 3){
            patterns.push((intenseLvlStart + 3 ) * hrauselValues[0]);

        } else {
            patterns.push(intenseLvlStart * hrauselValues[0]);
        }
    }

    else if (i >= 16 && i < 17) {
        if (intimacyStart === 2 || intimacyStart === 3 || intimacyStart === 6){

            patterns.push((intenseLvlStart + 2 ) * hrauselValues[0]);

        } else if (intimacyStart === 7){
            patterns.push((intenseLvlStart + 1 ) * hrauselValues[0]);

        }  else if (intimacyStart === 4){
            patterns.push((intenseLvlStart + 3 ) * hrauselValues[0]);

        } else {
            patterns.push(intenseLvlStart * hrauselValues[0]);
        }
    }


    else if (i >= 17 && i < 18) {
        if (intimacyStart === 2){

            patterns.push((intenseLvlStart + 2 ) * hrauselValues[0]);

        } else if (intimacyStart === 3 || intimacyStart === 5){
            patterns.push((intenseLvlStart + 1 ) * hrauselValues[0]);

        } else {
            patterns.push(intenseLvlStart * hrauselValues[0]);
        }
    }


    else if (i >= 18 && i < 19) {
        if (intimacyStart === 2 || intimacyStart === 5){

            patterns.push((intenseLvlStart + 1 ) * hrauselValues[0]);

        } else {
            patterns.push(intenseLvlStart * hrauselValues[0]);
        }
    }

    else if (i >= 19 && i < 20) {
        patterns.push(intenseLvlStart * hrauselValues[0]); 
    }

    else if (i >= 20 && i < 21) {
        if (intimacyStart === 6){

            patterns.push((intenseLvlStart + 2 ) * hrauselValues[0]);

        } else {
            patterns.push(intenseLvlStart * hrauselValues[0]);
        }
    }

    else if (i >= 21 && i < 22) {
        if (intimacyStart === 5){

            patterns.push((intenseLvlStart + 1 ) * hrauselValues[0]);

        } else if (intimacyStart === 6){
            patterns.push((intenseLvlStart + 2 ) * hrauselValues[0]);

        } else {
            patterns.push(intenseLvlStart * hrauselValues[0]);
        }
    }

    else if (i >= 22 && i < 23) {
        if (intimacyStart === 5 || intimacyStart === 7){

            patterns.push((intenseLvlStart + 1 ) * hrauselValues[0]);

        } else if (intimacyStart === 4 || intimacyStart === 6){
            patterns.push((intenseLvlStart + 2 ) * hrauselValues[0]);

        } else {
            patterns.push(intenseLvlStart * hrauselValues[0]);
        }
    }


    else if (i >= 23 && i < 24) {
        if (intimacyStart === 3){

            patterns.push((intenseLvlStart + 1 ) * hrauselValues[0]);

        } else if (intimacyStart === 7){
            patterns.push((intenseLvlStart + 2 ) * hrauselValues[0]);

        } else {
            patterns.push(intenseLvlStart * hrauselValues[0]);
        }
    }


    else if (i >= 24 && i < 25) {
        if (intimacyStart === 3){

            patterns.push((intenseLvlStart + 2 ) * hrauselValues[0]);

        } else if (intimacyStart === 7){
            patterns.push((intenseLvlStart + 3 ) * hrauselValues[0]);

        } else {
            patterns.push(intenseLvlStart * hrauselValues[0]);
        }
    }


    else if (i >= 25 && i < 26) {
        if (intimacyStart === 5){
            patterns.push((intenseLvlStart + 1 ) * hrauselValues[0]);
            
        } else if (intimacyStart === 7){
            patterns.push((intenseLvlStart + 2 ) * hrauselValues[0]);

        } else if (intimacyStart === 3){
            patterns.push((intenseLvlStart + 3 ) * hrauselValues[0]);

        } else {
            patterns.push(intenseLvlStart * hrauselValues[0]);
        }
    }


    else if (i >= 26 && i < 27) {
        if (intimacyStart === 5 || intimacyStart === 7){
            patterns.push((intenseLvlStart + 1 ) * hrauselValues[0]);

        } else if (intimacyStart === 6 || intimacyStart === 3){
            patterns.push((intenseLvlStart + 2 ) * hrauselValues[0]);

        } else {
            patterns.push(intenseLvlStart * hrauselValues[0]);
        }
    }


    else if (i >= 27 && i < 28) {
        if (intimacyStart === 3){
            patterns.push((intenseLvlStart + 1 ) * hrauselValues[0]);

        } else if (intimacyStart === 6){
            patterns.push((intenseLvlStart + 2 ) * hrauselValues[0]);

        } else if (intimacyStart === 4){
            patterns.push((intenseLvlStart + 3 ) * hrauselValues[0]);

        } else {
            patterns.push(intenseLvlStart * hrauselValues[0]);
        }
    }


    else if (i >= 28 && i < 29) {
        if (intimacyStart === 2){
            patterns.push((intenseLvlStart + 1 ) * hrauselValues[0]);

        } else if (intimacyStart === 6){
            patterns.push((intenseLvlStart + 2 ) * hrauselValues[0]);

        } else {
            patterns.push(intenseLvlStart * hrauselValues[0]);
        }
    }


    else if (i >= 29 && i < 31) {
        if (intimacyStart === 5){
            patterns.push((intenseLvlStart + 1 ) * hrauselValues[0]);

        } else if (intimacyStart === 2){
            patterns.push((intenseLvlStart + 2 ) * hrauselValues[0]);

        } else {
            patterns.push(intenseLvlStart * hrauselValues[0]);
        }
    }

    else if (i >= 31 && i < 32) {
        if (intimacyStart === 2){
            patterns.push((intenseLvlStart + 2 ) * hrauselValues[0]);

        } else {
            patterns.push(intenseLvlStart * hrauselValues[0]);
        }
    }

    else if (i >= 32 && i < 33) {
        if (intimacyStart === 7){
            patterns.push((intenseLvlStart + 1 ) * hrauselValues[0]);

        } else if (intimacyStart === 2 || intimacyStart === 4 || intimacyStart === 6){ 
            patterns.push((intenseLvlStart + 2 ) * hrauselValues[0]);

        } else {
            patterns.push(intenseLvlStart * hrauselValues[0]);
        }
    }


    else if (i >= 33 && i < 34) {
        if (intimacyStart === 3 || intimacyStart === 5){
            patterns.push((intenseLvlStart + 1 ) * hrauselValues[0]);

        } else if (intimacyStart === 2 || intimacyStart === 6 || intimacyStart === 7){ 
            patterns.push((intenseLvlStart + 2 ) * hrauselValues[0]);

        } else {
            patterns.push(intenseLvlStart * hrauselValues[0]);
        }
    }

    
    else if (i >= 34 && i < 35) {
        if (intimacyStart === 5){
            patterns.push((intenseLvlStart + 1 ) * hrauselValues[0]);

        } else if (intimacyStart === 2 || intimacyStart === 3 || intimacyStart === 6){ 
            patterns.push((intenseLvlStart + 2 ) * hrauselValues[0]);

        } else if (intimacyStart === 7){ 
            patterns.push((intenseLvlStart + 3 ) * hrauselValues[0]);

        } else {
            patterns.push(intenseLvlStart * hrauselValues[0]);
        }
    }

    else if (i >= 35 && i < 36) {
        if (intimacyStart === 2 || intimacyStart === 7){
            patterns.push((intenseLvlStart + 2 ) * hrauselValues[0]);

        } else if (intimacyStart === 3){ 
            patterns.push((intenseLvlStart + 3 ) * hrauselValues[0]);

        } else {
            patterns.push(intenseLvlStart * hrauselValues[0]);
        }
    }


    else if (i >= 36 && i < 37) {
        if (intimacyStart === 7){
            patterns.push((intenseLvlStart + 1 ) * hrauselValues[0]);

        } else if (intimacyStart === 2 || intimacyStart === 3){ 
            patterns.push((intenseLvlStart + 2 ) * hrauselValues[0]);

        } else if (intimacyStart === 4){ 
            patterns.push((intenseLvlStart + 3 ) * hrauselValues[0]);

        } else {
            patterns.push(intenseLvlStart * hrauselValues[0]);
        }
    }


    else if (i >= 37 && i < 38) {
        if (intimacyStart === 3 || intimacyStart === 5){
            patterns.push((intenseLvlStart + 1 ) * hrauselValues[0]);

        } else if (intimacyStart === 2){ 
            patterns.push((intenseLvlStart + 2 ) * hrauselValues[0]);

        } else {
            patterns.push(intenseLvlStart * hrauselValues[0]);
        }
    }


    else if (i >= 38 && i < 39) {
        if (intimacyStart === 2 || intimacyStart === 5){
            patterns.push((intenseLvlStart + 1 ) * hrauselValues[0]);

        } else {
            patterns.push(intenseLvlStart * hrauselValues[0]);
        }
    }

    else if (i >= 39 && i < 40) {
        patterns.push(intenseLvlStart * hrauselValues[0]);
    }

    else if (i >= 40 && i < 41) {
        patterns.push((intenseLvlMidway) * hrauselValues[0]);
    }

    else if (i >= 41 && i < 42) {
        if (intimacyMidway === 5){
            patterns.push((intenseLvlMidway + 1 ) * hrauselValues[0]);
        } else {
            patterns.push(intenseLvlMidway * hrauselValues[0]);
        }
    }
    else if (i >= 42 && i < 43) {
        if (intimacyMidway === 5 || intimacyMidway === 7){
            patterns.push((intenseLvlMidway + 1 ) * hrauselValues[0]);
        } else if (intimacyMidway === 4 || intimacyMidway === 6){
            patterns.push((intenseLvlMidway + 2 ) * hrauselValues[0]);
        } else {
            patterns.push(intenseLvlMidway * hrauselValues[0]);
        }
    }

    else if (i >= 43 && i < 44) {
        if (intimacyMidway === 3){
            patterns.push((intenseLvlMidway + 1 ) * hrauselValues[0]);
        } else if (intimacyMidway === 6 || intimacyMidway === 7){
            patterns.push((intenseLvlMidway + 2 ) * hrauselValues[0]);
        } else {
            patterns.push(intenseLvlMidway * hrauselValues[0]);
        }
    }

    else if (i >= 44 && i < 45) {
        if (intimacyMidway === 3 || intimacyMidway === 6){
            patterns.push((intenseLvlMidway + 2 ) * hrauselValues[0]);
        } else if (intimacyMidway === 7){
            patterns.push((intenseLvlMidway + 3 ) * hrauselValues[0]);
        } else {
            patterns.push(intenseLvlMidway * hrauselValues[0]);
        }
    }

    else if (i >= 45 && i < 46) {
        if (intimacyMidway === 5 ){
            patterns.push((intenseLvlMidway + 1 ) * hrauselValues[0]);
        } else if (intimacyMidway === 7){
            patterns.push((intenseLvlMidway + 2 ) * hrauselValues[0]);
        } else if (intimacyMidway === 3){
            patterns.push((intenseLvlMidway + 3 ) * hrauselValues[0]);
        } else {
            patterns.push(intenseLvlMidway * hrauselValues[0]);
        }
    }

    else if (i >= 46 && i < 47) {
        if (intimacyMidway === 5 || intimacyMidway === 7){
            patterns.push((intenseLvlMidway + 1 ) * hrauselValues[0]);
        } else if (intimacyMidway === 3){
            patterns.push((intenseLvlMidway + 2 ) * hrauselValues[0]);
        } else {
            patterns.push(intenseLvlMidway * hrauselValues[0]);
        }
    }

    else if (i >= 47 && i < 48) {
        if (intimacyMidway === 3 ){
            patterns.push((intenseLvlMidway + 1 ) * hrauselValues[0]);
        } else if (intimacyMidway === 4){
            patterns.push((intenseLvlMidway + 3 ) * hrauselValues[0]);
        } else {
            patterns.push(intenseLvlMidway * hrauselValues[0]);
        }
    }


    else if (i >= 48 && i < 49) {
        if (intimacyMidway === 2 ){
            patterns.push((intenseLvlMidway + 1 ) * hrauselValues[0]);
        } else if (intimacyMidway === 6){
            patterns.push((intenseLvlMidway + 2 ) * hrauselValues[0]);
        } else {
            patterns.push(intenseLvlMidway * hrauselValues[0]);
        }
    }

    else if (i >= 49 && i < 51) {
        if (intimacyMidway === 5 ){
            patterns.push((intenseLvlMidway + 1 ) * hrauselValues[0]);
        } else if (intimacyMidway === 2 || intimacyMidway === 6){
            patterns.push((intenseLvlMidway + 2 ) * hrauselValues[0]);
        } else {
            patterns.push(intenseLvlMidway * hrauselValues[0]);
        }
    }


    else if (i >= 51 && i < 52) {
        if (intimacyMidway === 2 ){
            patterns.push((intenseLvlMidway + 2 ) * hrauselValues[0]);
        } else {
            patterns.push(intenseLvlMidway * hrauselValues[0]);
        }
    }

    else if (i >= 52 && i < 53) {
        if (intimacyMidway === 7 ){
            patterns.push((intenseLvlMidway + 1 ) * hrauselValues[0]);
        } else if (intimacyMidway === 2 || intimacyMidway === 4){
            patterns.push((intenseLvlMidway + 2 ) * hrauselValues[0]);
        } else {
            patterns.push(intenseLvlMidway * hrauselValues[0]);
        }
    }


    else if (i >= 53 && i < 54) {
        if (intimacyMidway === 3 || intimacyMidway === 5){
            patterns.push((intenseLvlMidway + 1 ) * hrauselValues[0]);
        } else if (intimacyMidway === 2 || intimacyMidway === 7){
            patterns.push((intenseLvlMidway + 2 ) * hrauselValues[0]);
        } else {
            patterns.push(intenseLvlMidway * hrauselValues[0]);
        }
    }


    else if (i >= 54 && i < 55) {
        if (intimacyMidway === 5){
            patterns.push((intenseLvlMidway + 1 ) * hrauselValues[0]);
        } else if (intimacyMidway === 2 || intimacyMidway === 3 || intimacyMidway === 6){ 
            patterns.push((intenseLvlMidway + 2 ) * hrauselValues[0]);
        } else if (intimacyMidway === 7){
            patterns.push((intenseLvlMidway + 3 ) * hrauselValues[0]);
        } else {
            patterns.push(intenseLvlMidway * hrauselValues[0]);
        }
    }

    
    else if (i >= 55 && i < 56) {
        if (intimacyMidway === 2 || intimacyMidway === 6 || intimacyMidway === 7){
            patterns.push((intenseLvlMidway + 2 ) * hrauselValues[0]);
        } else if (intimacyMidway === 3){ 
            patterns.push((intenseLvlMidway + 3 ) * hrauselValues[0]);
        }  else {
            patterns.push(intenseLvlMidway * hrauselValues[0]);
        }
    }

    else if (i >= 56 && i < 57) {
        if (intimacyMidway === 7 ){
            patterns.push((intenseLvlMidway + 1 ) * hrauselValues[0]);
        } else if (intimacyMidway === 2 || intimacyMidway === 3 || intimacyMidway === 6){ 
            patterns.push((intenseLvlMidway + 2 ) * hrauselValues[0]);
        } else if (intimacyMidway === 4){ 
            patterns.push((intenseLvlMidway + 3 ) * hrauselValues[0]);
        }  else {
            patterns.push(intenseLvlMidway * hrauselValues[0]);
        }
    }

    else if (i >= 57 && i < 58) {
        if (intimacyMidway === 3 || intimacyMidway === 5){
            patterns.push((intenseLvlMidway + 1 ) * hrauselValues[0]);
        } else if (intimacyMidway === 2 ){ 
            patterns.push((intenseLvlMidway + 2 ) * hrauselValues[0]);
        } else {
            patterns.push(intenseLvlMidway * hrauselValues[0]);
        }
    }

    else if (i >= 58 && i < 59) {
        if (intimacyMidway === 2 || intimacyMidway === 5){
            patterns.push((intenseLvlMidway + 1 ) * hrauselValues[0]);
        } else {
            patterns.push(intenseLvlMidway * hrauselValues[0]);
        }
    }

    else if (i >= 59 && i < 60) {
        patterns.push(intenseLvlMidway * hrauselValues[0]);
    }

    else if (i >= 60 && i < 61) {
        if (intimacyMidway === 6){
            patterns.push((intenseLvlMidway + 2 ) * hrauselValues[0]);
        } else {
            patterns.push(intenseLvlMidway * hrauselValues[0]);
        }
    }

    else if (i >= 61 && i < 62) {
        if (intimacyMidway === 5){
            patterns.push((intenseLvlMidway + 1 ) * hrauselValues[0]);
        } else if (intimacyMidway === 6){
            patterns.push((intenseLvlMidway + 2 ) * hrauselValues[0]);
        } else {
            patterns.push(intenseLvlMidway * hrauselValues[0]);
        }
    }

    else if (i >= 62 && i < 63) {
        if (intimacyMidway === 5 || intimacyMidway === 7){
            patterns.push((intenseLvlMidway + 1 ) * hrauselValues[0]);
        } else if (intimacyMidway === 4 || intimacyMidway === 6){
            patterns.push((intenseLvlMidway + 2 ) * hrauselValues[0]);
        } else {
            patterns.push(intenseLvlMidway * hrauselValues[0]);
        }
    }

    else if (i >= 63 && i < 64) {
        if (intimacyMidway === 3){
            patterns.push((intenseLvlMidway + 1 ) * hrauselValues[0]);
        } else if (intimacyMidway === 7){
            patterns.push((intenseLvlMidway + 2 ) * hrauselValues[0]);
        } else {
            patterns.push(intenseLvlMidway * hrauselValues[0]);
        }
    }

    else if (i >= 64 && i < 65) {
        if (intimacyMidway === 3){
            patterns.push((intenseLvlMidway + 2 ) * hrauselValues[0]);
        } else if (intimacyMidway === 7){
            patterns.push((intenseLvlMidway + 3 ) * hrauselValues[0]);
        } else {
            patterns.push(intenseLvlMidway * hrauselValues[0]);
        }
    }

    else if (i >= 65 && i < 66) {
        if (intimacyMidway === 5){
            patterns.push((intenseLvlMidway + 1 ) * hrauselValues[0]);
        } else if (intimacyMidway === 7){
            patterns.push((intenseLvlMidway + 2 ) * hrauselValues[0]);
        } else if (intimacyMidway === 3){
            patterns.push((intenseLvlMidway + 3 ) * hrauselValues[0]);
        } else {
            patterns.push(intenseLvlMidway * hrauselValues[0]);
        }
    }

    else if (i >= 66 && i < 67) {
        if (intimacyMidway === 5 || intimacyMidway === 7){
            patterns.push((intenseLvlMidway + 1 ) * hrauselValues[0]);
        } else if (intimacyMidway === 3 || intimacyMidway === 6){
            patterns.push((intenseLvlMidway + 2 ) * hrauselValues[0]);
        } else {
            patterns.push(intenseLvlMidway * hrauselValues[0]);
        }
    }

    else if (i >= 67 && i < 68) {
        if (intimacyMidway === 3){
            patterns.push((intenseLvlMidway + 1 ) * hrauselValues[0]);
        } else if (intimacyMidway === 6){
            patterns.push((intenseLvlMidway + 2 ) * hrauselValues[0]);
        } else if (intimacyMidway === 4){
            patterns.push((intenseLvlMidway + 3 ) * hrauselValues[0]);
        } else {
            patterns.push(intenseLvlMidway * hrauselValues[0]);
        }
    }

    else if (i >= 68 && i < 69) {
        if (intimacyMidway === 2){
            patterns.push((intenseLvlMidway + 1 ) * hrauselValues[0]);
        } else if (intimacyMidway === 6){
            patterns.push((intenseLvlMidway + 2 ) * hrauselValues[0]);
        } else {
            patterns.push(intenseLvlMidway * hrauselValues[0]);
        }
    }

    else if (i >= 69 && i < 71) {
        if (intimacyMidway === 5){
            patterns.push((intenseLvlMidway + 1 ) * hrauselValues[0]);
        } else if (intimacyMidway === 2){
            patterns.push((intenseLvlMidway + 2 ) * hrauselValues[0]);
        } else {
            patterns.push(intenseLvlMidway * hrauselValues[0]);
        }
    }

    else if (i >= 71 && i < 72) {
        if (intimacyMidway === 2){
            patterns.push((intenseLvlMidway + 2 ) * hrauselValues[0]);
        } else {
            patterns.push(intenseLvlMidway * hrauselValues[0]);
        }
    }

    else if (i >= 72 && i < 73) {
        if (intimacyMidway === 7){
            patterns.push((intenseLvlMidway + 1 ) * hrauselValues[0]);
        } else if (intimacyMidway === 2 || intimacyMidway === 4 || intimacyMidway === 6){
            patterns.push((intenseLvlMidway + 2 ) * hrauselValues[0]);
        } else {
            patterns.push(intenseLvlMidway * hrauselValues[0]);
        }
    }
    
    else if (i >= 73 && i < 74) {
        if (intimacyMidway === 3 || intimacyMidway === 5){
            patterns.push((intenseLvlMidway + 1 ) * hrauselValues[0]);
        } else if (intimacyMidway === 2 || intimacyMidway === 6 || intimacyMidway === 7){
            patterns.push((intenseLvlMidway + 2 ) * hrauselValues[0]);
        } else {
            patterns.push(intenseLvlMidway * hrauselValues[0]);
        }
    }
    
    else if (i >= 74 && i < 75) {
        if (intimacyMidway === 5){
            patterns.push((intenseLvlMidway + 1 ) * hrauselValues[0]);
        } else if (intimacyMidway === 2 || intimacyMidway === 3 || intimacyMidway === 6){
            patterns.push((intenseLvlMidway + 2 ) * hrauselValues[0]);
        } else if (intimacyMidway === 7 ){
            patterns.push((intenseLvlMidway + 3 ) * hrauselValues[0]);
        } else {
            patterns.push(intenseLvlMidway * hrauselValues[0]);
        }
    }

    else if (i >= 75 && i < 76) {
        if (intimacyMidway === 2 || intimacyMidway === 7){
            patterns.push((intenseLvlMidway + 2 ) * hrauselValues[0]);
        } else if (intimacyMidway === 3 ){
            patterns.push((intenseLvlMidway + 3 ) * hrauselValues[0]);
        } else {
            patterns.push(intenseLvlMidway * hrauselValues[0]);
        }
    }

    else if (i >= 76 && i < 77) {
        if (intimacyMidway === 7){
            patterns.push((intenseLvlMidway + 1 ) * hrauselValues[0]);
        } else if (intimacyMidway === 2 || intimacyMidway === 3){
            patterns.push((intenseLvlMidway + 2 ) * hrauselValues[0]);
        } else if (intimacyMidway === 4){
            patterns.push((intenseLvlMidway + 3 ) * hrauselValues[0]);
        } else {
            patterns.push(intenseLvlMidway * hrauselValues[0]);
        }
    }

    else if (i >= 77 && i < 78) {
        if (intimacyMidway === 3 || intimacyMidway === 5){
            patterns.push((intenseLvlMidway + 1 ) * hrauselValues[0]);
        } else if (intimacyMidway === 2 ){
            patterns.push((intenseLvlMidway + 2 ) * hrauselValues[0]);
        } else {
            patterns.push(intenseLvlMidway * hrauselValues[0]);
        }
    }

    else if (i >= 78 && i < 79) {
        if (intimacyMidway === 2 || intimacyMidway === 5){
            patterns.push((intenseLvlMidway + 1 ) * hrauselValues[0]);
        } else {
            patterns.push(intenseLvlMidway * hrauselValues[0]);
        }
    }

    else if (i >= 79 && i < 80) {
        patterns.push(intenseLvlMidway * hrauselValues[0]); 
    }

    else if (i >= 80 && i < 81) {
        if (intimacyEnd === 10 && intenseLvlEnd === 10){
            patterns.push((intenseLvlEnd - 4 ) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 9){
            patterns.push((intenseLvlEnd - 3 ) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 8){
            patterns.push((intenseLvlEnd - 2 ) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 7){
            patterns.push((intenseLvlEnd - 1 ) * hrauselValues[0]);
        } else {
            patterns.push(intenseLvlEnd * hrauselValues[0]);
        }
    }
    else if (i >= 81 && i < 82) {
        if (intimacyEnd === 5 || intimacyEnd === 9){
            patterns.push((intenseLvlEnd + 1 ) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 10){
            patterns.push((intenseLvlEnd - 4 ) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 9){
            patterns.push((intenseLvlEnd - 3 ) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 8){
            patterns.push((intenseLvlEnd - 2 ) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 7){
            patterns.push((intenseLvlEnd - 1 ) * hrauselValues[0]);
        } else {
            patterns.push(intenseLvlEnd * hrauselValues[0]);
        }
    }

    else if (i >= 82 && i < 83) {
        if (intimacyEnd === 5 || intimacyEnd === 7){
            patterns.push((intenseLvlEnd + 1 ) * hrauselValues[0]);
        } else if (intimacyEnd === 4 || intimacyEnd === 6){
            patterns.push((intenseLvlEnd + 2 ) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 10){
            patterns.push((intenseLvlEnd - 4 ) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 9){
            patterns.push((intenseLvlEnd - 3 ) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 8){
            patterns.push((intenseLvlEnd - 2 ) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 7){
            patterns.push((intenseLvlEnd - 1 ) * hrauselValues[0]);
        } else {
            patterns.push(intenseLvlEnd * hrauselValues[0]);
        }
    }

    else if (i >= 83 && i < 84) {
        if (intimacyEnd === 3 ){
            patterns.push((intenseLvlEnd + 1 ) * hrauselValues[0]);
        } else if (intimacyEnd === 6 || intimacyEnd === 7){
            patterns.push((intenseLvlEnd + 2 ) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 10){
            patterns.push((intenseLvlEnd - 4 ) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 9){
            patterns.push((intenseLvlEnd - 3 ) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 8){
            patterns.push((intenseLvlEnd - 2 ) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 7){
            patterns.push((intenseLvlEnd - 1 ) * hrauselValues[0]);
        } else {
            patterns.push(intenseLvlEnd * hrauselValues[0]);
        }
    }

    else if (i >= 84 && i < 85) {
        if (intimacyEnd === 3 || intimacyEnd === 6){
            patterns.push((intenseLvlEnd + 2 ) * hrauselValues[0]);
        } else if (intimacyEnd === 7 ){
            patterns.push((intenseLvlEnd + 3 ) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 10){
            patterns.push((intenseLvlEnd - 4 ) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 9){
            patterns.push((intenseLvlEnd - 3 ) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 8){
            patterns.push((intenseLvlEnd - 2 ) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 7){
            patterns.push((intenseLvlEnd - 1 ) * hrauselValues[0]);
        } else {
            patterns.push(intenseLvlEnd * hrauselValues[0]);
        }
    }

    else if (i >= 85 && i < 86) {
        if (intimacyEnd === 5 ){
            patterns.push((intenseLvlEnd + 1 ) * hrauselValues[0]);
        } else if (intimacyEnd === 7){
            patterns.push((intenseLvlEnd + 2 ) * hrauselValues[0]);
        } else if (intimacyEnd === 3){
            patterns.push((intenseLvlEnd + 3 ) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 10){
            patterns.push((intenseLvlEnd - 4 ) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 9){
            patterns.push((intenseLvlEnd - 3 ) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 8){
            patterns.push((intenseLvlEnd - 2 ) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 7){
            patterns.push((intenseLvlEnd - 1 ) * hrauselValues[0]);
        } else {
            patterns.push(intenseLvlEnd * hrauselValues[0]);
        }
    }

    else if (i >= 86 && i < 87) {
        if (intimacyEnd === 5 || intimacyEnd === 7){
            patterns.push((intenseLvlEnd + 1 ) * hrauselValues[0]);
        } else if (intimacyEnd === 3){
            patterns.push((intenseLvlEnd + 2 ) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 10){
            patterns.push((intenseLvlEnd - 4 ) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 9){
            patterns.push((intenseLvlEnd - 3 ) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 8){
            patterns.push((intenseLvlEnd - 2 ) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 7){
            patterns.push((intenseLvlEnd - 1 ) * hrauselValues[0]);
        } else {
            patterns.push(intenseLvlEnd * hrauselValues[0]);
        }
    }

    else if (i >= 87 && i < 88) {
        if (intimacyEnd === 3 ){
            patterns.push((intenseLvlEnd + 1 ) * hrauselValues[0]);
        } else if (intimacyEnd === 4){
            patterns.push((intenseLvlEnd + 3 ) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 10){
            patterns.push((intenseLvlEnd - 4 ) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 9){
            patterns.push((intenseLvlEnd - 3 ) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 8){
            patterns.push((intenseLvlEnd - 2 ) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 7){
            patterns.push((intenseLvlEnd - 1 ) * hrauselValues[0]);
        } else {
            patterns.push(intenseLvlEnd * hrauselValues[0]);
        }
    }

    else if (i >= 88 && i < 89) {
        if (intimacyEnd === 2 && intenseLvlEnd < 10){
            patterns.push((intenseLvlEnd + 1 ) * hrauselValues[0]);
        } else if (intimacyEnd === 6){
            patterns.push((intenseLvlEnd + 2 ) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 10){
            patterns.push((intenseLvlEnd - 4 ) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 9){
            patterns.push((intenseLvlEnd - 3 ) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 8){
            patterns.push((intenseLvlEnd - 2 ) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 7){
            patterns.push((intenseLvlEnd - 1 ) * hrauselValues[0]);
        } else {
            patterns.push(intenseLvlEnd * hrauselValues[0]);
        }
    }
    
    else if (i >= 89 && i < 91) {
        if (intimacyEnd === 5 ){
            patterns.push((intenseLvlEnd + 1 ) * hrauselValues[0]);
        } else if (intimacyEnd === 2 || intimacyEnd === 6){
            patterns.push((intenseLvlEnd + 2 ) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 10){
            patterns.push((intenseLvlEnd - 4 ) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 9){
            patterns.push((intenseLvlEnd - 3 ) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 8){
            patterns.push((intenseLvlEnd - 2 ) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 7){
            patterns.push((intenseLvlEnd - 1 ) * hrauselValues[0]);
        } else {
            patterns.push(intenseLvlEnd * hrauselValues[0]);
        }
    }
    
    else if (i >= 91 && i < 92) {
        if (intimacyEnd === 2 ){
            patterns.push((intenseLvlEnd + 2 ) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 10){
            patterns.push((intenseLvlEnd - 4 ) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 9){
            patterns.push((intenseLvlEnd - 3 ) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 8){
            patterns.push((intenseLvlEnd - 2 ) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 7){
            patterns.push((intenseLvlEnd - 1 ) * hrauselValues[0]);
        } else {
            patterns.push(intenseLvlEnd * hrauselValues[0]);
        }
    }
    
    else if (i >= 92 && i < 93) {
        if (intimacyEnd === 7 ){
            patterns.push((intenseLvlEnd + 1 ) * hrauselValues[0]);
        } else if (intimacyEnd === 2 || intimacyEnd === 4){
            patterns.push((intenseLvlEnd + 2 ) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 10){
            patterns.push((intenseLvlEnd - 4 ) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 9){
            patterns.push((intenseLvlEnd - 3 ) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 8){
            patterns.push((intenseLvlEnd - 2 ) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 7){
            patterns.push((intenseLvlEnd - 1 ) * hrauselValues[0]);
        } else {
            patterns.push(intenseLvlEnd * hrauselValues[0]);
        }
    }

    else if (i >= 93 && i < 94) {
        if (intimacyEnd === 3 || intimacyEnd === 5){
            patterns.push((intenseLvlEnd + 1 ) * hrauselValues[0]);
        } else if (intimacyEnd === 2 || intimacyEnd === 7){
            patterns.push((intenseLvlEnd + 2 ) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 10){
            patterns.push((intenseLvlEnd - 4 ) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 9){
            patterns.push((intenseLvlEnd - 3 ) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 8){
            patterns.push((intenseLvlEnd - 2 ) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 7){
            patterns.push((intenseLvlEnd - 1 ) * hrauselValues[0]);
        } else {
            patterns.push(intenseLvlEnd * hrauselValues[0]);
        }
    }
    
    else if (i >= 94 && i < 95) {
        if (intimacyEnd === 5){
            patterns.push((intenseLvlEnd + 1 ) * hrauselValues[0]);
        } else if (intimacyEnd === 2 || intimacyEnd === 3 || intimacyEnd === 6){
            patterns.push((intenseLvlEnd + 2 ) * hrauselValues[0]);
        } else if (intimacyEnd === 7){
            patterns.push((intenseLvlEnd + 3 ) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 10){
            patterns.push((intenseLvlEnd - 4 ) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 9){
            patterns.push((intenseLvlEnd - 3 ) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 8){
            patterns.push((intenseLvlEnd - 2 ) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 7){
            patterns.push((intenseLvlEnd - 1 ) * hrauselValues[0]);
        } else {
            patterns.push(intenseLvlEnd * hrauselValues[0]);
        }
    }

    else if (i >= 95 && i < 96) {
        if (intimacyEnd === 2 || intimacyEnd === 6 || intimacyEnd === 7){
            patterns.push((intenseLvlEnd + 2 ) * hrauselValues[0]);
        } else if (intimacyEnd === 3 ){
            patterns.push((intenseLvlEnd + 3 ) * hrauselValues[0]);
        }  else if (intimacyEnd === 10 && intenseLvlEnd === 10){
            patterns.push((intenseLvlEnd - 4 ) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 9){
            patterns.push((intenseLvlEnd - 3 ) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 8){
            patterns.push((intenseLvlEnd - 2 ) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 7){
            patterns.push((intenseLvlEnd - 1 ) * hrauselValues[0]);
        } else {
            patterns.push(intenseLvlEnd * hrauselValues[0]);
        }
    }
    
    else if (i >= 96 && i < 97) {
        if (intimacyEnd === 7){
            patterns.push((intenseLvlEnd + 1 ) * hrauselValues[0]);
        } else if (intimacyEnd === 2 || intimacyEnd === 3 || intimacyEnd === 6){
            patterns.push((intenseLvlEnd + 2 ) * hrauselValues[0]);
        } else if (intimacyEnd === 4){
            patterns.push((intenseLvlEnd + 3 ) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 10){
            patterns.push((intenseLvlEnd - 4 ) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 9){
            patterns.push((intenseLvlEnd - 3 ) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 8){
            patterns.push((intenseLvlEnd - 2 ) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 7){
            patterns.push((intenseLvlEnd - 1 ) * hrauselValues[0]);
        } else {
            patterns.push(intenseLvlEnd * hrauselValues[0]);
        }
    }
    
    else if (i >= 97 && i < 98) {
        if (intimacyEnd === 3 || intimacyEnd === 5){
            patterns.push((intenseLvlEnd + 1 ) * hrauselValues[0]);
        } else if (intimacyEnd === 2 ){
            patterns.push((intenseLvlEnd + 2 ) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 10){
            patterns.push((intenseLvlEnd - 4 ) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 9){
            patterns.push((intenseLvlEnd - 3 ) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 8){
            patterns.push((intenseLvlEnd - 2 ) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 7){
            patterns.push((intenseLvlEnd - 1 ) * hrauselValues[0]);
        } else {
            patterns.push(intenseLvlEnd * hrauselValues[0]);
        }
    }
    
    else if (i >= 98 && i < 99) {
        if (intimacyEnd === 2 || intimacyEnd === 5){
            patterns.push((intenseLvlEnd + 1 ) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 10){
            patterns.push((intenseLvlEnd - 4 ) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 9){
            patterns.push((intenseLvlEnd - 3 ) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 8){
            patterns.push((intenseLvlEnd - 2 ) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 7){
            patterns.push((intenseLvlEnd - 1 ) * hrauselValues[0]);
        } else {
            patterns.push(intenseLvlEnd * hrauselValues[0]);
        }
    }
    
    else if (i >= 99 && i < 100) {
        if (intimacyEnd === 10 && intenseLvlEnd === 10){
            patterns.push((intenseLvlEnd - 4 ) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 9){
            patterns.push((intenseLvlEnd - 3 ) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 8){
            patterns.push((intenseLvlEnd - 2 ) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 7){
            patterns.push((intenseLvlEnd - 1 ) * hrauselValues[0]);
        } else {
            patterns.push(intenseLvlEnd * hrauselValues[0]);
        }
    }
    
    else if (i >= 100 && i < 101) {
        if (intimacyEnd === 6) {
            patterns.push((intenseLvlEnd + 2) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 10) {
            patterns.push((intenseLvlEnd - 1) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd >= 1 && intenseLvlEnd <= 6) {
            patterns.push((intenseLvlEnd + 1) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 10) {
            patterns.push((intenseLvlEnd - 3) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 9) {
            patterns.push((intenseLvlEnd - 2) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 8) {
            patterns.push((intenseLvlEnd - 1) * hrauselValues[0]);
        } else {
            patterns.push(intenseLvlEnd * hrauselValues[0]);
        }
        
    }

    else if (i >= 101 && i < 102) {
        if (intimacyEnd === 5) {
            patterns.push((intenseLvlEnd + 1) * hrauselValues[0]);
        } else if (intimacyEnd === 6) {
            patterns.push((intenseLvlEnd + 2) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 10) {
            patterns.push((intenseLvlEnd - 1) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd >= 1 && intenseLvlEnd <= 6) {
            patterns.push((intenseLvlEnd + 1) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 10) {
            patterns.push((intenseLvlEnd - 3) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 9) {
            patterns.push((intenseLvlEnd - 2) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 8) {
            patterns.push((intenseLvlEnd - 1) * hrauselValues[0]);
        } else {
            patterns.push(intenseLvlEnd * hrauselValues[0]);
        }              
    }
    
    else if (i >= 102 && i < 103) {
        if (intimacyEnd === 4) {
            patterns.push((intenseLvlEnd + 2) * hrauselValues[0]);
        } else if (intimacyEnd === 5) {
            patterns.push((intenseLvlEnd + 1) * hrauselValues[0]);
        } else if (intimacyEnd === 6) {
            patterns.push((intenseLvlEnd + 2) * hrauselValues[0]);
        } else if (intimacyEnd === 7) {
            patterns.push((intenseLvlEnd + 1) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 10) {
            patterns.push((intenseLvlEnd - 2) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 9) {
            patterns.push((intenseLvlEnd - 1) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd >= 1 && intenseLvlEnd <= 6) {
            patterns.push((intenseLvlEnd + 1) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 10) {
            patterns.push((intenseLvlEnd - 3) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 9) {
            patterns.push((intenseLvlEnd - 2) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 8) {
            patterns.push((intenseLvlEnd - 1) * hrauselValues[0]);
        } else {
            patterns.push(intenseLvlEnd * hrauselValues[0]);
        }
                 
    }

    else if (i >= 103 && i < 104) {
        if (intimacyEnd === 3) {
            patterns.push((intenseLvlEnd + 1) * hrauselValues[0]);
        } else if (intimacyEnd === 7) {
            patterns.push((intenseLvlEnd + 2) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 10) {
            patterns.push((intenseLvlEnd - 2) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 9) {
            patterns.push((intenseLvlEnd - 1) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd >= 1 && intenseLvlEnd <= 6) {
            patterns.push((intenseLvlEnd + 2) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 7) {
            patterns.push((intenseLvlEnd + 1) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 10) {
            patterns.push((intenseLvlEnd - 2) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 9) {
            patterns.push((intenseLvlEnd - 1) * hrauselValues[0]);
        } else {
            patterns.push(intenseLvlEnd * hrauselValues[0]);
        }         
    }
    
    else if (i >= 104 && i < 105) {
        if (intimacyEnd === 3) {
            patterns.push((intenseLvlEnd + 2) * hrauselValues[0]);
        } else if (intimacyEnd === 7) {
            patterns.push((intenseLvlEnd + 3) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 10) {
            patterns.push((intenseLvlEnd - 3) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 9) {
            patterns.push((intenseLvlEnd - 2) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 8) {
            patterns.push((intenseLvlEnd - 1) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd >= 1 && intenseLvlEnd <= 6) {
            patterns.push((intenseLvlEnd + 2) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 7) {
            patterns.push((intenseLvlEnd + 1) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 10) {
            patterns.push((intenseLvlEnd - 2) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 9) {
            patterns.push((intenseLvlEnd - 1) * hrauselValues[0]);
        } else {
            patterns.push(intenseLvlEnd * hrauselValues[0]);
        }
        
    }
    
    else if (i >= 105 && i < 106) {
        if (intimacyEnd === 3) {
            patterns.push((intenseLvlEnd + 3) * hrauselValues[0]);
        } else if (intimacyEnd === 7) {
            patterns.push((intenseLvlEnd + 2) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 10) {
            patterns.push((intenseLvlEnd - 3) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 9) {
            patterns.push((intenseLvlEnd - 2) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 8) {
            patterns.push((intenseLvlEnd - 1) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd >= 1 && intenseLvlEnd <= 6) {
            patterns.push((intenseLvlEnd + 2) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 7) {
            patterns.push((intenseLvlEnd + 1) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 10) {
            patterns.push((intenseLvlEnd - 2) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 9) {
            patterns.push((intenseLvlEnd - 1) * hrauselValues[0]);
        } else {
            patterns.push(intenseLvlEnd * hrauselValues[0]);
        }
        
        
    }
    
    else if (i >= 106 && i < 107) {
        if (intimacyEnd === 3) {
            patterns.push((intenseLvlEnd + 2) * hrauselValues[0]);
        } else if (intimacyEnd === 5) {
            patterns.push((intenseLvlEnd + 1) * hrauselValues[0]);
        } else if (intimacyEnd === 6) {
            patterns.push((intenseLvlEnd + 2) * hrauselValues[0]);
        } else if (intimacyEnd === 7) {
            patterns.push((intenseLvlEnd + 1) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 10) {
            patterns.push((intenseLvlEnd - 4) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 9) {
            patterns.push((intenseLvlEnd - 3) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 8) {
            patterns.push((intenseLvlEnd - 2) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 7) {
            patterns.push((intenseLvlEnd - 1) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd >= 1 && intenseLvlEnd <= 6) {
            patterns.push((intenseLvlEnd + 3) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 7) {
            patterns.push((intenseLvlEnd + 2) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 8) {
            patterns.push((intenseLvlEnd + 1) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 10) {
            patterns.push((intenseLvlEnd - 1) * hrauselValues[0]);
        } else {
            patterns.push(intenseLvlEnd * hrauselValues[0]);
        }
    }
    
    else if (i >= 107 && i < 108) {
        if (intimacyEnd === 3) {
            patterns.push((intenseLvlEnd + 1) * hrauselValues[0]);
        } else if (intimacyEnd === 4) {
            patterns.push((intenseLvlEnd + 3) * hrauselValues[0]);
        } else if (intimacyEnd === 6) {
            patterns.push((intenseLvlEnd + 2) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 10) {
            patterns.push((intenseLvlEnd - 4) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 9) {
            patterns.push((intenseLvlEnd - 3) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 8) {
            patterns.push((intenseLvlEnd - 2) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 7) {
            patterns.push((intenseLvlEnd - 1) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd >= 1 && intenseLvlEnd <= 6) {
            patterns.push((intenseLvlEnd + 3) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 7) {
            patterns.push((intenseLvlEnd + 2) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 8) {
            patterns.push((intenseLvlEnd + 1) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 10) {
            patterns.push((intenseLvlEnd - 1) * hrauselValues[0]);
        } else {
            patterns.push(intenseLvlEnd * hrauselValues[0]);
        }
        
    }
    
    else if (i >= 108 && i < 109) {
        if (intimacyEnd === 2) {
            patterns.push((intenseLvlEnd + 1) * hrauselValues[0]);
        } else if (intimacyEnd === 6) {
            patterns.push((intenseLvlEnd + 2) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 10) {
            patterns.push((intenseLvlEnd - 5) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 9) {
            patterns.push((intenseLvlEnd - 4) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 8) {
            patterns.push((intenseLvlEnd - 3) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 7) {
            patterns.push((intenseLvlEnd - 2) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 6) {
            patterns.push((intenseLvlEnd - 1) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd >= 1 && intenseLvlEnd <= 5) {
            patterns.push((intenseLvlEnd + 3) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 6) {
            patterns.push((intenseLvlEnd + 3) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 7) {
            patterns.push((intenseLvlEnd + 2) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 8) {
            patterns.push((intenseLvlEnd + 1) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 10) {
            patterns.push((intenseLvlEnd - 1) * hrauselValues[0]);
        } else {
            patterns.push(intenseLvlEnd * hrauselValues[0]);
        }
        
    }
    
    else if (i >= 109 && i < 110) {
        if (intimacyEnd === 2) {
            patterns.push((intenseLvlEnd + 2) * hrauselValues[0]);
        } else if (intimacyEnd === 5) {
            patterns.push((intenseLvlEnd + 1) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 10) {
            patterns.push((intenseLvlEnd - 5) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 9) {
            patterns.push((intenseLvlEnd - 4) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 8) {
            patterns.push((intenseLvlEnd - 3) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 7) {
            patterns.push((intenseLvlEnd - 2) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 6) {
            patterns.push((intenseLvlEnd - 1) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd >= 1 && intenseLvlEnd <= 5) {
            patterns.push((intenseLvlEnd + 4) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 6) {
            patterns.push((intenseLvlEnd + 4) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 7) {
            patterns.push((intenseLvlEnd + 3) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 8) {
            patterns.push((intenseLvlEnd + 2) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 9) {
            patterns.push((intenseLvlEnd + 1) * hrauselValues[0]);
        } else {
            patterns.push(intenseLvlEnd * hrauselValues[0]);
        }
    }
    
    else if (i >= 110 && i < 111) {
        if (intimacyEnd === 2) {
            patterns.push((intenseLvlEnd + 2) * hrauselValues[0]);
        } else if (intimacyEnd === 5) {
            patterns.push((intenseLvlEnd + 1) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 10) {
            patterns.push((intenseLvlEnd - 6) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 9) {
            patterns.push((intenseLvlEnd - 5) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 8) {
            patterns.push((intenseLvlEnd - 4) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 7) {
            patterns.push((intenseLvlEnd - 3) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 6) {
            patterns.push((intenseLvlEnd - 2) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 5) {
            patterns.push((intenseLvlEnd - 1) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd >= 1 && intenseLvlEnd <= 6) {
            patterns.push((intenseLvlEnd + 4) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 7) {
            patterns.push((intenseLvlEnd + 3) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 8) {
            patterns.push((intenseLvlEnd + 2) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 9) {
            patterns.push((intenseLvlEnd + 1) * hrauselValues[0]);
        } else {
            patterns.push(intenseLvlEnd * hrauselValues[0]);
        }            
    }
    
    else if (i >= 111 && i < 112) {
        if (intimacyEnd === 2) {
            patterns.push((intenseLvlEnd + 2) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 10) {
            patterns.push((intenseLvlEnd - 6) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 9) {
            patterns.push((intenseLvlEnd - 5) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 8) {
            patterns.push((intenseLvlEnd - 4) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 7) {
            patterns.push((intenseLvlEnd - 3) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 6) {
            patterns.push((intenseLvlEnd - 2) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 5) {
            patterns.push((intenseLvlEnd - 1) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd >= 1 && intenseLvlEnd <= 6) {
            patterns.push((intenseLvlEnd + 4) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 7) {
            patterns.push((intenseLvlEnd + 3) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 8) {
            patterns.push((intenseLvlEnd + 2) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 9) {
            patterns.push((intenseLvlEnd + 1) * hrauselValues[0]);
        } else {
            patterns.push(intenseLvlEnd * hrauselValues[0]);
        }                     
    }
    
    else if (i >= 112 && i < 113) {
        if (intimacyEnd === 2) {
            patterns.push((intenseLvlEnd + 2) * hrauselValues[0]);
        } else if (intimacyEnd === 4) {
            patterns.push((intenseLvlEnd + 2) * hrauselValues[0]);
        } else if (intimacyEnd === 6) {
            patterns.push((intenseLvlEnd + 2) * hrauselValues[0]);
        } else if (intimacyEnd === 7) {
            patterns.push((intenseLvlEnd + 1) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 10) {
            patterns.push((intenseLvlEnd - 7) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 9) {
            patterns.push((intenseLvlEnd - 6) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 8) {
            patterns.push((intenseLvlEnd - 5) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 7) {
            patterns.push((intenseLvlEnd - 4) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 6) {
            patterns.push((intenseLvlEnd - 3) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 5) {
            patterns.push((intenseLvlEnd - 2) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 4) {
            patterns.push((intenseLvlEnd - 1) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 1) {
            patterns.push((intenseLvlEnd + 4) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 2) {
            patterns.push((intenseLvlEnd + 4) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 3) {
            patterns.push((intenseLvlEnd + 4) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 4) {
            patterns.push((intenseLvlEnd + 4) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 5) {
            patterns.push((intenseLvlEnd + 4) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 6) {
            patterns.push((intenseLvlEnd + 4) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 7) {
            patterns.push((intenseLvlEnd + 3) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 8) {
            patterns.push((intenseLvlEnd + 2) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 9) {
            patterns.push((intenseLvlEnd + 1) * hrauselValues[0]);
        } else {
            patterns.push(intenseLvlEnd * hrauselValues[0]);
        }
               
    }

    else if (i >= 113 && i < 114) {
        if (intimacyEnd === 2) {
            patterns.push((intenseLvlEnd + 2) * hrauselValues[0]);
        } else if (intimacyEnd === 3) {
            patterns.push((intenseLvlEnd + 1) * hrauselValues[0]);
        } else if (intimacyEnd === 5) {
            patterns.push((intenseLvlEnd + 1) * hrauselValues[0]);
        } else if (intimacyEnd === 6) {
            patterns.push((intenseLvlEnd + 2) * hrauselValues[0]);
        } else if (intimacyEnd === 7) {
            patterns.push((intenseLvlEnd + 2) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 10) {
            patterns.push((intenseLvlEnd - 7) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 9) {
            patterns.push((intenseLvlEnd - 6) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 8) {
            patterns.push((intenseLvlEnd - 5) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 7) {
            patterns.push((intenseLvlEnd - 4) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 6) {
            patterns.push((intenseLvlEnd - 3) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 5) {
            patterns.push((intenseLvlEnd - 2) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 4) {
            patterns.push((intenseLvlEnd - 1) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 1) {
            patterns.push((intenseLvlEnd + 4) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 2) {
            patterns.push((intenseLvlEnd + 4) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 3) {
            patterns.push((intenseLvlEnd + 4) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 4) {
            patterns.push((intenseLvlEnd + 4) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 5) {
            patterns.push((intenseLvlEnd + 4) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 6) {
            patterns.push((intenseLvlEnd + 4) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 7) {
            patterns.push((intenseLvlEnd + 3) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 8) {
            patterns.push((intenseLvlEnd + 2) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 9) {
            patterns.push((intenseLvlEnd + 1) * hrauselValues[0]);
        } else {
            patterns.push(intenseLvlEnd * hrauselValues[0]);
        }        
    }

    else if (i >= 114 && i < 115) {
        if (intimacyEnd === 2) {
            patterns.push((intenseLvlEnd + 2) * hrauselValues[0]);
        } else if (intimacyEnd === 3) {
            patterns.push((intenseLvlEnd + 2) * hrauselValues[0]);
        } else if (intimacyEnd === 5) {
            patterns.push((intenseLvlEnd + 1) * hrauselValues[0]);
        } else if (intimacyEnd === 6) {
            patterns.push((intenseLvlEnd + 2) * hrauselValues[0]);
        } else if (intimacyEnd === 7) {
            patterns.push((intenseLvlEnd + 3) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 10) {
            patterns.push((intenseLvlEnd - 8) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 9) {
            patterns.push((intenseLvlEnd - 7) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 8) {
            patterns.push((intenseLvlEnd - 6) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 7) {
            patterns.push((intenseLvlEnd - 5) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 6) {
            patterns.push((intenseLvlEnd - 4) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 5) {
            patterns.push((intenseLvlEnd - 3) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 4) {
            patterns.push((intenseLvlEnd - 2) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 3) {
            patterns.push((intenseLvlEnd - 1) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 1) {
            patterns.push((intenseLvlEnd + 4) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 2) {
            patterns.push((intenseLvlEnd + 4) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 3) {
            patterns.push((intenseLvlEnd + 4) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 4) {
            patterns.push((intenseLvlEnd + 4) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 5) {
            patterns.push((intenseLvlEnd + 4) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 6) {
            patterns.push((intenseLvlEnd + 4) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 7) {
            patterns.push((intenseLvlEnd + 3) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 8) {
            patterns.push((intenseLvlEnd + 2) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 9) {
            patterns.push((intenseLvlEnd + 1) * hrauselValues[0]);
        } else {
            patterns.push(intenseLvlEnd * hrauselValues[0]);
        }
        
    }

    else if (i >= 115 && i < 116) {
        if (intimacyEnd === 2) {
            patterns.push((intenseLvlEnd + 2) * hrauselValues[0]);
        } else if (intimacyEnd === 3) {
            patterns.push((intenseLvlEnd + 3) * hrauselValues[0]);
        } else if (intimacyEnd === 7) {
            patterns.push((intenseLvlEnd + 2) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 10) {
            patterns.push((intenseLvlEnd - 8) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 9) {
            patterns.push((intenseLvlEnd - 7) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 8) {
            patterns.push((intenseLvlEnd - 6) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 7) {
            patterns.push((intenseLvlEnd - 5) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 6) {
            patterns.push((intenseLvlEnd - 4) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 5) {
            patterns.push((intenseLvlEnd - 3) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 4) {
            patterns.push((intenseLvlEnd - 2) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 3) {
            patterns.push((intenseLvlEnd - 1) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 1) {
            patterns.push((intenseLvlEnd + 4) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 2) {
            patterns.push((intenseLvlEnd + 4) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 3) {
            patterns.push((intenseLvlEnd + 4) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 4) {
            patterns.push((intenseLvlEnd + 4) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 5) {
            patterns.push((intenseLvlEnd + 4) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 6) {
            patterns.push((intenseLvlEnd + 4) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 7) {
            patterns.push((intenseLvlEnd + 3) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 8) {
            patterns.push((intenseLvlEnd + 2) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 9) {
            patterns.push((intenseLvlEnd + 1) * hrauselValues[0]);
        } else {
            patterns.push(intenseLvlEnd * hrauselValues[0]);
        }
        
        
    }

    else if (i >= 116 && i < 117) {
        if (intimacyEnd === 2) {
            patterns.push((intenseLvlEnd + 2) * hrauselValues[0]);
        } else if (intimacyEnd === 3) {
            patterns.push((intenseLvlEnd + 2) * hrauselValues[0]);
        } else if (intimacyEnd === 4) {
            patterns.push((intenseLvlEnd + 3) * hrauselValues[0]);
        } else if (intimacyEnd === 7) {
            patterns.push((intenseLvlEnd + 1) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 10) {
            patterns.push((intenseLvlEnd - 9) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 9) {
            patterns.push((intenseLvlEnd - 8) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 8) {
            patterns.push((intenseLvlEnd - 7) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 7) {
            patterns.push((intenseLvlEnd - 6) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 6) {
            patterns.push((intenseLvlEnd - 5) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 5) {
            patterns.push((intenseLvlEnd - 4) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 4) {
            patterns.push((intenseLvlEnd - 3) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 3) {
            patterns.push((intenseLvlEnd - 2) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 2) {
            patterns.push((intenseLvlEnd - 1) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 1) {
            patterns.push((intenseLvlEnd + 4) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 2) {
            patterns.push((intenseLvlEnd + 4) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 3) {
            patterns.push((intenseLvlEnd + 4) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 4) {
            patterns.push((intenseLvlEnd + 4) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 5) {
            patterns.push((intenseLvlEnd + 4) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 6) {
            patterns.push((intenseLvlEnd + 4) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 7) {
            patterns.push((intenseLvlEnd + 3) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 8) {
            patterns.push((intenseLvlEnd + 2) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 9) {
            patterns.push((intenseLvlEnd + 1) * hrauselValues[0]);
        } else {
            patterns.push(intenseLvlEnd * hrauselValues[0]);
        } 
    }

    else if (i >= 117 && i < 118) {
        if (intimacyEnd === 2) {
            patterns.push((intenseLvlEnd + 2) * hrauselValues[0]);
        } else if (intimacyEnd === 3) {
            patterns.push((intenseLvlEnd + 1) * hrauselValues[0]);
        } else if (intimacyEnd === 5) {
            patterns.push((intenseLvlEnd + 1) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 10) {
            patterns.push((intenseLvlEnd - 9) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 9) {
            patterns.push((intenseLvlEnd - 8) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 8) {
            patterns.push((intenseLvlEnd - 7) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 7) {
            patterns.push((intenseLvlEnd - 6) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 6) {
            patterns.push((intenseLvlEnd - 5) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 5) {
            patterns.push((intenseLvlEnd - 4) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 4) {
            patterns.push((intenseLvlEnd - 3) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 3) {
            patterns.push((intenseLvlEnd - 2) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 2) {
            patterns.push((intenseLvlEnd - 1) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 1) {
            patterns.push((intenseLvlEnd + 4) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 2) {
            patterns.push((intenseLvlEnd + 4) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 3) {
            patterns.push((intenseLvlEnd + 4) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 4) {
            patterns.push((intenseLvlEnd + 4) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 5) {
            patterns.push((intenseLvlEnd + 4) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 6) {
            patterns.push((intenseLvlEnd + 4) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 7) {
            patterns.push((intenseLvlEnd + 3) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 8) {
            patterns.push((intenseLvlEnd + 2) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 9) {
            patterns.push((intenseLvlEnd + 1) * hrauselValues[0]);
        } else {
            patterns.push(intenseLvlEnd * hrauselValues[0]);
        } 
    }

    else if (i >= 118 && i < 119) {
        if (intimacyEnd === 2) {
            patterns.push((intenseLvlEnd + 1) * hrauselValues[0]);
        } else if (intimacyEnd === 5) {
            patterns.push((intenseLvlEnd + 1) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 10) {
            patterns.push((intenseLvlEnd - 9) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 9) {
            patterns.push((intenseLvlEnd - 8) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 8) {
            patterns.push((intenseLvlEnd - 7) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 7) {
            patterns.push((intenseLvlEnd - 6) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 6) {
            patterns.push((intenseLvlEnd - 5) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 5) {
            patterns.push((intenseLvlEnd - 4) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 4) {
            patterns.push((intenseLvlEnd - 3) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 3) {
            patterns.push((intenseLvlEnd - 2) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 2) {
            patterns.push((intenseLvlEnd - 1) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 1) {
            patterns.push((intenseLvlEnd + 4) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 2) {
            patterns.push((intenseLvlEnd + 4) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 3) {
            patterns.push((intenseLvlEnd + 4) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 4) {
            patterns.push((intenseLvlEnd + 4) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 5) {
            patterns.push((intenseLvlEnd + 4) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 6) {
            patterns.push((intenseLvlEnd + 4) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 7) {
            patterns.push((intenseLvlEnd + 3) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 8) {
            patterns.push((intenseLvlEnd + 2) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 9) {
            patterns.push((intenseLvlEnd + 1) * hrauselValues[0]);
        } else {
            patterns.push(intenseLvlEnd * hrauselValues[0]);
        }
        
    }

    else if (i >= 119 && i < 120) {
        if (intimacyEnd === 8 && intenseLvlEnd === 10) {
            patterns.push((intenseLvlEnd - 9) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 9) {
            patterns.push((intenseLvlEnd - 8) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 8) {
            patterns.push((intenseLvlEnd - 7) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 7) {
            patterns.push((intenseLvlEnd - 6) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 6) {
            patterns.push((intenseLvlEnd - 5) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 5) {
            patterns.push((intenseLvlEnd - 4) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 4) {
            patterns.push((intenseLvlEnd - 3) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 3) {
            patterns.push((intenseLvlEnd - 2) * hrauselValues[0]);
        } else if (intimacyEnd === 8 && intenseLvlEnd === 2) {
            patterns.push((intenseLvlEnd - 1) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 1) {
            patterns.push((intenseLvlEnd + 4) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 2) {
            patterns.push((intenseLvlEnd + 4) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 3) {
            patterns.push((intenseLvlEnd + 4) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 4) {
            patterns.push((intenseLvlEnd + 4) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 5) {
            patterns.push((intenseLvlEnd + 4) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 6) {
            patterns.push((intenseLvlEnd + 4) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 7) {
            patterns.push((intenseLvlEnd + 3) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 8) {
            patterns.push((intenseLvlEnd + 2) * hrauselValues[0]);
        } else if (intimacyEnd === 10 && intenseLvlEnd === 9) {
            patterns.push((intenseLvlEnd + 1) * hrauselValues[0]);
        } else {
            patterns.push(intenseLvlEnd * hrauselValues[0]);
        }
    }



    else {
        patterns.push(''); // Empty for other rows
    }
    


    return patterns;
}

module.exports = { getVibrationIntensity };