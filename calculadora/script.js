const display = document.getElementById("display");

        /*
        // Permitir solo determinados caracteres
        display.addEventListener("input", function() {
            //-- Expresión regular para permitir solo números y determinados caracteres
            const regex = /^[0-9\+\-\²  *()\/\.]+$/;
    
            //-- Obtiene el valor actual del campo
            let valor = display.value;
    
            //-- Si el valor no coincide con la expresión regular, se corrige
            if (!regex.test(valor)) {
                //-- Elimina los caracteres no permitidos
                display.value = valor.replace(/[^0-9\+\-²\*\/\.]/g, '');
            }
        });

        */

        // Evento del clear
        function clearAll () {
            display.value = "";
        }

        // Evento del backspace
        function deleteLast () {
            let value_string = display.value.toString();

            if (value_string.length == 1){
                display.value = "";
            }
            else{
                new_value = value_string.slice(0, value_string.length -1);

                if (display.value != "") {
                    display.value = new_value;
            }            
            }
        }

        // Evento del igual
        function equalTo () {      
            /*-- Cuando se oprima el igual, se cambiarán internamente
            √, ² y % si están presentes antes de evaluar la expresión
            */

            let value_string = display.value.toString(); // Convertir la expresión a cadena para modificar

            //-- Condición de raíz cuadrada
            let new_sqrtString = '';
            let modded_sqrt = false;

            for (let i = 0; i < value_string.length; i++) {
                if (value_string[i] == '√'){
                    new_sqrtString += 'Math.sqrt(';

                    //-- Avanzar al siguiente carácter después de '√'
                    i++;
                    //-- Mientras lo que esté detrás del √ sea un número, se incluye adentro del () hasta que ya no lo sea
                    while (i < value_string.length && (/[0-9.]/).test(value_string[i])) {
                        new_sqrtString += value_string[i];
                        i++;
                    }

                    new_sqrtString += ')';
                    modded_sqrt = true;
                    i--; // Retroceder un paso porque el bucle for también incrementará i
                }
                else {
                    new_sqrtString += value_string[i];
                }        
            }

            //-- Condición de elevación al cuadrado
            if (modded_sqrt == true){
                value_string = new_sqrtString;
            }

            let new_powString = '';
            let modded_pow = false;
            let inside_bracketsPow = '';
            

            for (let i = 0; i < value_string.length; i++) {
                if (value_string[i] == '²') {  // (3455 + 67)² --> "3455 + 67"
                    let j = i - 2;
                   
                        while ((value_string[j] != '(') && (j > 0)){
                            j--;
                        }

                        j++;

                        while ((value_string[j] != ')') && (j < value_string.length)){
                            inside_bracketsPow += value_string[j];
                            j++;
                        }
                    
                    new_powString = new_powString.replace(("(" + inside_bracketsPow + ")"), "");

                    new_powString += "(" + inside_bracketsPow + ")" + "**2";
                    modded_pow = true;

                } else {
                    new_powString += value_string[i];
                }
            }

            if (modded_pow){
                value_string = new_powString;
            }

            new_percentString = '';
            let behind_percent = '';
            let modded_percent = false;

            // Condición de porcentaje
            for (let i = 0; i < value_string.length; i++) {
                if (value_string[i] == "%") {
                    new_percentString += " / 100";
                    modded_percent = true;
                } else {
                    new_percentString += value_string[i];
                }
            }

            if(modded_percent){
                value_string = new_percentString;
            }

            try{
                // Se evalúa la expresión modificada internamente
                let result = eval(value_string);

                if (result == undefined) {
                    display.value = "";
                } else {
                display.value = result;
                } 

            } catch (error) {
                //-- Manejar cualquier error de sintaxis
                if (error instanceof SyntaxError){
                    alert("Error de sintaxis. Ingrese una expresión válida.");
                    display.value = '';
                }          
            }
        }


        // Escribir números o punto
        function appendNumber (number) {
            if (display.selectionStart !== null && display.selectionEnd !== null) {
                // Inserta el texto en la posición actual del cursor
                display.setRangeText(number, display.selectionStart, display.selectionEnd, "end");
            } else {
                // Si por alguna razón no hay selección, agrega al final (fallback)
                display.value += number;
            }          
        }

        // Escribir paréntesis
        function appendParenthesis (parenthesis) {
            if (display.selectionStart !== null && display.selectionEnd !== null) {
                // Inserta el texto en la posición actual del cursor
                display.setRangeText(parenthesis, display.selectionStart, display.selectionEnd, "end");
            } else {
                // Si por alguna razón no hay selección, agrega al final (fallback)
                display.value += parenthesis;
            }        
        }

        // Escribir operación
        function appendOperation (operation) {
            if (display.selectionStart !== null && display.selectionEnd !== null) {
                // Inserta el texto en la posición actual del cursor
                display.setRangeText(operation, display.selectionStart, display.selectionEnd, "end");
            } else {
                // Si por alguna razón no hay selección, agrega al final (fallback)
                display.value += operation;
            }        
        }

        // Escribir elevación al cuadrado
        function appendSquare () {
            display.value += "()²";
            let posicionDesdeFinal = display.value.length - 2;

            display.focus();
            display.setSelectionRange(posicionDesdeFinal, posicionDesdeFinal);
        }

        // Función del botón memoria
        function pressMemory() {
            //-- Mostrar/Ocultar menú de memoria
            let menu = document.getElementById('menu');
            let calc_cover = document.getElementById('calc-cover');
            const allButtons = document.querySelectorAll('.btn, .clear, .equals');

            if (menu.style.display == "block"){
                menu.style.display = "none";

                //-- Achicar calc-cover al ocultar      
                calc_cover.style.height = "320px";
                calc_cover.style.backgroundPositionY = "40px";

            } else {
                menu.style.display = "block";

                //-- Agrandar calc-cover al mostrar           
                calc_cover.style.height = "380px";
                calc_cover.style.backgroundPositionY = "70px";
            }           
        }

        // Local Storage
        // Función de guardar
        function saveDisplay(){
            if (display.value != ""){
                // Obtener operaciones guardadas o crear array vacío si no existen
                const saved_operations = JSON.parse(localStorage.getItem("saved_operations")) || [];
        
                // Agregar el nuevo valor al array
                saved_operations.push(display.value);
        
                // Guardar el array actualizado
                localStorage.setItem("saved_operations", JSON.stringify(saved_operations));
        
                // Feedback visual
                alert("Operación guardada correctamente!");
            }
            else{
                alert("No hay valores para guardar.")
            }
        }

        // Función de ver historial
        let advanced_index = 0;

        function seeHistory() {
            //-- Obtener operaciones guardadas o crear array vacío si no existen
            const saved_operations = JSON.parse(localStorage.getItem("saved_operations")) || [];

            saved_operations.reverse(); // Revertir para ver el último primero

            //-- Si no se ha terminado de recorrer el historial...
            if (advanced_index < saved_operations.length){
                display.value = saved_operations[advanced_index];
                advanced_index++;
            }
            else{
                alert("No hay más valores guardados.");
                display.value = "";
                advanced_index = 0;
            }
        }