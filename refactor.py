import json
import time
import requests

# Configura tu API Key de Gemini
GEMINI_API_KEY = "AQUÍ_TU_API_KEY_DE_GEMINI"
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + GEMINI_API_KEY

def refactorizar_nombre(nombre):
    prompt = f"""
Refactoriza el siguiente nombre de escuela, jardín o establecimiento para que tenga el siguiente formato uniforme:

- Mantén las siglas como \"JIN\" o \"JINN\" sin cambiarlas.
- La palabra \"Escuela\" debe ir con mayúscula inicial.
- El número debe estar precedido por \"N°\" con espacio antes del número.
- Los nombres propios deben llevar tildes donde correspondan.
- Si hay anexos o referencias a otras escuelas, mantenerlas con formato claro.
- El nombre principal debe ir entre comillas dobles.

Ejemplos:
Entrada: ESCUELA JARDÍN N46 “CHELA GÓMEZ MORILLA “
Salida: Escuela Jardín N° 46 \"Chela Gómez Morilla\"

Entrada: JINN°3 ANEXO ESCUELAS N°157
Salida: JIN N° 3 - Anexo Escuela N° 157

Ahora refactoriza este nombre:
{nombre}
Respuesta:"""
    try:
        print(f"Llamando a la API de Gemini para: {nombre}")
        headers = {"Content-Type": "application/json"}
        data = {
            "contents": [
                {"parts": [{"text": prompt}]}
            ]
        }
        response = requests.post(GEMINI_API_URL, headers=headers, json=data)
        if response.status_code == 200:
            result = response.json()
            # Extraer la respuesta generada
            texto = result.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")
            print(f"Respuesta recibida de Gemini para: {nombre}")
            return texto.strip()
        else:
            print(f"Error en la respuesta de Gemini: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"Error al procesar '{nombre}': {e}")
        return None

def main():
    print("Abriendo archivo de entrada 'nombres.json'...")
    with open('nombres.json', 'r', encoding='utf-8-sig') as f:
        escuelas = json.load(f)
    print(f"Total de escuelas a procesar: {len(escuelas)}")

    for idx, escuela in enumerate(escuelas, start=1):
        nombre_original = escuela.get("nombre", "")
        if nombre_original:
            print(f"[{idx}] Refactorizando: {nombre_original}")
            refactorizado = refactorizar_nombre(nombre_original)
            print(f"[{idx}] Resultado: {refactorizado}")
            if refactorizado:
                escuela["nombre refactorizado"] = refactorizado
            else:
                print(f"[{idx}] No se pudo refactorizar, se deja el original.")
                escuela["nombre refactorizado"] = nombre_original
            time.sleep(1)  # evitar límite de tasa
        else:
            print(f"[{idx}] Escuela sin nombre, se omite.")

    print("Guardando archivo de salida 'nombres_refactorizados.json'...")
    with open('nombres_refactorizados.json', 'w', encoding='utf-8-sig') as f:
        json.dump(escuelas, f, ensure_ascii=False, indent=2)

    print("Proceso completado.")

if __name__ == "__main__":
    main()