import os
from PIL import Image

def create_thumbnails(directory):
    # Przechodzimy przez wszystkie pliki w katalogu
    for filename in os.listdir(directory):
        filepath = os.path.join(directory, filename)

        # Sprawdzamy, czy plik jest obrazem
        if os.path.isfile(filepath) and filename.lower().endswith((".jpg", ".jpeg", ".png", ".bmp", ".gif")):
            try:
                # Otwieramy obraz
                with Image.open(filepath) as img:
                    # Zachowujemy proporcje, dostosowując najdłuższy bok do 200 pikseli
                    img.thumbnail((200, 200))

                    # Generujemy nową nazwę pliku z _thumb
                    base, ext = os.path.splitext(filename)
                    new_filename = f"{base}_thumb{ext}"
                    new_filepath = os.path.join(directory, new_filename)

                    # Zapisujemy miniaturkę w tym samym formacie
                    img.save(new_filepath, format=img.format)

                    print(f"Miniaturka utworzona: {new_filename}")
            except Exception as e:
                print(f"Błąd podczas przetwarzania pliku {filename}: {e}")

if __name__ == "__main__":
    # Pobieramy ścieżkę do katalogu, w którym znajduje się skrypt
    script_dir = os.path.dirname(os.path.abspath(__file__))
    images_dir = script_dir

    print("Tworzenie miniaturek...")
    create_thumbnails(images_dir)
    print("Gotowe!")