# HMI Web Starter - EV Charging Station Interface

A responsive web interface designed for EV charging stations with Raspberry Pi displays.

## Features

- **Multi-page Navigation**: Navigate between different charging station screens
- **Keyboard Navigation**: Use number keys (0, 1, 2) for quick navigation
- **Virtual Keyboard**: Touch-friendly number input with auto-formatting
- **Payment Integration**: Direct payment and app-based payment options
- **Responsive Design**: Optimized for various screen sizes
- **Real-time Clock**: Live timestamp display

## Project Structure

```
hmi-web-starter/
├── src/
│   ├── pages/           # HTML pages
│   │   ├── index.html   # Main page
│   │   ├── trang0.html  # Page 0
│   │   ├── trang2.html  # Page 2 (main charging interface)
│   │   ├── trang2_1.html # Page 2.1 (charging options)
│   │   ├── trang2_1_TTTT.html # Direct payment page
│   │   ├── trang2_1_app.html  # App payment page
│   │   └── ...
│   ├── assets/
│   │   ├── css/         # Stylesheets
│   │   │   └── styles.css
│   │   ├── js/          # JavaScript files
│   │   │   └── script.js
│   │   └── images/      # Images and icons
│   └── components/      # Reusable components
├── index.html           # Entry point
├── package.json         # Project configuration
└── README.md           # This file
```

## Navigation

### Main Navigation
- **Arrow Keys**: Navigate between main pages (0, 1, 2, 3)
- **Number Keys**: Quick access to sub-pages
  - Press `1` on Page 2 → Go to Page 2.1
  - Press `2` on Page 2 → Go to Page 2.2
  - Press `0` on any sub-page → Return to Page 2

### Payment Flow
1. Navigate to Page 2
2. Press `1` or `2` to select charging port
3. Choose payment method:
   - **Direct Payment**: Enter amount with virtual keyboard
   - **App Payment**: Use Rabbit EVC app

## Installation

1. Clone the repository:
```bash
git clone https://github.com/khanhvu4603/HMI-Web-used-for-Raspberry-displays-Rabbit_charge-.git
cd hmi-web-starter
```

2. Start the development server:
```bash
npm start
# or
python -m http.server 8000
```

3. Open your browser and navigate to `http://localhost:8000`

## Usage

### For Raspberry Pi
1. Install a web browser (Chromium recommended)
2. Set the browser to fullscreen mode
3. Configure auto-start on boot
4. Point to the local server

### For Development
1. Use `npm run dev` for development server
2. Use `npm run serve` for production-like testing

## Customization

### Adding New Pages
1. Create HTML file in `src/pages/`
2. Update navigation in `src/assets/js/script.js`
3. Add corresponding CSS in `src/assets/css/styles.css`

### Modifying Payment Options
1. Edit payment buttons in `trang2_1.html` and `trang2_2.html`
2. Update virtual keyboard in `script.js`
3. Customize payment flow as needed

## Browser Support

- Chrome/Chromium (Recommended for Raspberry Pi)
- Firefox
- Safari
- Edge

## License

MIT License - see LICENSE file for details

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Support

For issues and questions, please create an issue on GitHub.
