import os
from PIL import Image

def create_thumbnails(directory):
    # Przechodzimy przez wszystkie pliki w katalogu
    for filename in os.listdir(directory):
        filepath = os.path.join(directory, filename)

        # Pomijamy plik "marcin.jpeg"
        if filename.lower() == "marcin.jpeg":
            print(f"Pomijam plik: {filename}")
            continue

        # Sprawdzamy, czy plik jest obrazem
        if os.path.isfile(filepath) and filename.lower().endswith((".jpg", ".jpeg", ".png", ".bmp", ".gif")):
            try:
                # Otwieramy obraz
                with Image.open(filepath) as img:
                    # Zachowujemy proporcje, dostosowując najdłuższy bok do 400 pikseli
                    img.thumbnail((400, 400))

                    # Generujemy nową nazwę pliku z _thumb, nadpisując istniejące miniaturki
                    if "_thumb" in filename.lower():
                        new_filename = filename
                    else:
                        base, ext = os.path.splitext(filename)
                        new_filename = f"{base}_thumb{ext}"
                    new_filepath = os.path.join(directory, new_filename)

                    # Zapisujemy miniaturkę w tym samym formacie, nadpisując istniejące pliki
                    img.save(new_filepath, format=img.format)

                    print(f"Miniaturka utworzona lub nadpisana: {new_filename}")
            except Exception as e:
                print(f"Błąd podczas przetwarzania pliku {filename}: {e}")

if __name__ == "__main__":
    # Pobieramy ścieżkę do katalogu, w którym znajduje się skrypt
    script_dir = os.path.dirname(os.path.abspath(__file__))
    images_dir = script_dir

    print("Tworzenie miniaturek...")
    create_thumbnails(images_dir)
    print("Gotowe!")
