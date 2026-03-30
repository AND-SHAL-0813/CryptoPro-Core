import java.io.*;
import java.util.*;

public class CryptoProject {

    static Scanner scanner = new Scanner(System.in);

    public static void main(String[] args) {
        int choice;

        do {
            System.out.println("\n--- Crypto Tool ---");
            System.out.println("1. Encrypt & Save");
            System.out.println("2. Read & Decrypt");
            System.out.println("3. Brute Force Decrypt");
            System.out.println("0. Exit");
            System.out.print("Choice: ");
            choice = scanner.nextInt();
            scanner.nextLine();

            switch (choice) {
                case 1 -> encryptFlow();
                case 2 -> decryptFlow();
                case 3 -> bruteForceFlow();
                case 0 -> System.out.println("Exiting...");
                default -> System.out.println("Invalid choice!");
            }

        } while (choice != 0);
    }

    static void encryptFlow() {
        System.out.print("Enter file name: ");
        String file = scanner.nextLine();

        System.out.print("Enter message: ");
        String msg = scanner.nextLine();

        System.out.print("Key (1-25): ");
        int key = scanner.nextInt();
        scanner.nextLine();

        String encrypted = caesarCipher(msg, key);
        saveToFile(file, encrypted);

        System.out.println("Encrypted: " + encrypted);
    }

    static void decryptFlow() {
        System.out.print("Enter file name: ");
        String file = scanner.nextLine();

        System.out.print("Key: ");
        int key = scanner.nextInt();
        scanner.nextLine();

        readAndDecrypt(file, key);
    }

    static void bruteForceFlow() {
        System.out.print("Enter encrypted text: ");
        String text = scanner.nextLine();

        for (int i = 1; i < 26; i++) {
            System.out.println("Key " + i + ": " + caesarCipher(text, 26 - i));
        }
    }

    public static String caesarCipher(String text, int shift) {
        StringBuilder result = new StringBuilder();
        for (char c : text.toCharArray()) {
            if (Character.isLetter(c)) {
                char base = Character.isLowerCase(c) ? 'a' : 'A';
                result.append((char) (base + (c - base + shift) % 26));
            } else {
                result.append(c);
            }
        }
        return result.toString();
    }

    public static void saveToFile(String file, String data) {
        try (PrintWriter out = new PrintWriter(new FileWriter(file, true))) {
            out.println(data);
        } catch (IOException e) {
            System.out.println("Error: " + e.getMessage());
        }
    }

    public static void readAndDecrypt(String file, int key) {
        try (BufferedReader br = new BufferedReader(new FileReader(file))) {
            String line;
            while ((line = br.readLine()) != null) {
                String decrypted = caesarCipher(line, 26 - key);
                System.out.println("Encrypted: " + line);
                System.out.println("Decrypted: " + decrypted);
            }
        } catch (IOException e) {
            System.out.println("File not found!");
        }
    }
}