import java.awt.*;
import java.io.*;
import javax.swing.*;

public class CryptoGUI {

    public static void main(String[] args) {

        JFrame frame = new JFrame("🔐 Crypto Tool");
        frame.setSize(650, 500);
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setLocationRelativeTo(null);

        Color bgColor = new Color(30, 30, 47);
        Color panelColor = new Color(42, 42, 64);
        Color buttonColor = new Color(108, 99, 255);

        JPanel panel = new JPanel(null);
        panel.setBackground(bgColor);

        JLabel title = new JLabel("Crypto Encryption Tool");
        title.setBounds(200, 10, 300, 30);
        title.setForeground(Color.WHITE);
        title.setFont(new Font("Arial", Font.BOLD, 18));
        panel.add(title);

        JTextArea input = new JTextArea();
        input.setBounds(50, 60, 520, 70);
        input.setBackground(panelColor);
        input.setForeground(Color.WHITE);
        panel.add(input);

        JTextArea output = new JTextArea();
        output.setBounds(50, 250, 520, 100);
        output.setBackground(panelColor);
        output.setForeground(Color.WHITE);
        panel.add(output);

        JTextField keyField = new JTextField();
        keyField.setBounds(50, 150, 100, 30);
        panel.add(keyField);

        JButton encryptBtn = new JButton("Encrypt");
        JButton decryptBtn = new JButton("Decrypt");
        JButton openBtn = new JButton("Open File");
        JButton saveBtn = new JButton("Save File");

        encryptBtn.setBounds(180, 150, 100, 30);
        decryptBtn.setBounds(290, 150, 100, 30);
        openBtn.setBounds(400, 150, 100, 30);
        saveBtn.setBounds(510, 150, 100, 30);

        styleButton(encryptBtn, buttonColor);
        styleButton(decryptBtn, buttonColor);
        styleButton(openBtn, buttonColor);
        styleButton(saveBtn, buttonColor);

        panel.add(encryptBtn);
        panel.add(decryptBtn);
        panel.add(openBtn);
        panel.add(saveBtn);

        // 🔐 Encrypt
        encryptBtn.addActionListener(e -> {
            try {
                String text = input.getText();
                int key = Integer.parseInt(keyField.getText());
                output.setText(caesar(text, key));
            } catch (Exception ex) {
                JOptionPane.showMessageDialog(frame, "Enter valid key!");
            }
        });

        // 🔓 Decrypt
        decryptBtn.addActionListener(e -> {
            try {
                String text = input.getText();
                int key = Integer.parseInt(keyField.getText());
                output.setText(caesar(text, 26 - key));
            } catch (Exception ex) {
                JOptionPane.showMessageDialog(frame, "Enter valid key!");
            }
        });

        // 📂 Open File
        openBtn.addActionListener(e -> {
            JFileChooser fileChooser = new JFileChooser();
            int result = fileChooser.showOpenDialog(frame);

            if (result == JFileChooser.APPROVE_OPTION) {
                File file = fileChooser.getSelectedFile();
                try (BufferedReader br = new BufferedReader(new FileReader(file))) {
                    input.setText("");
                    String line;
                    while ((line = br.readLine()) != null) {
                        input.append(line + "\n");
                    }
                } catch (IOException ex) {
                    JOptionPane.showMessageDialog(frame, "Error reading file!");
                }
            }
        });

        // 💾 Save File
        saveBtn.addActionListener(e -> {
            JFileChooser fileChooser = new JFileChooser();
            int result = fileChooser.showSaveDialog(frame);

            if (result == JFileChooser.APPROVE_OPTION) {
                File file = fileChooser.getSelectedFile();
                try (PrintWriter pw = new PrintWriter(new FileWriter(file))) {
                    pw.write(output.getText());
                    JOptionPane.showMessageDialog(frame, "File saved successfully!");
                } catch (IOException ex) {
                    JOptionPane.showMessageDialog(frame, "Error saving file!");
                }
            }
        });

        frame.add(panel);
        frame.setVisible(true);
    }

    static void styleButton(JButton btn, Color color) {
        btn.setBackground(color);
        btn.setForeground(Color.WHITE);
        btn.setFocusPainted(false);
        btn.setBorder(BorderFactory.createEmptyBorder());
    }

    static String caesar(String text, int shift) {
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
}