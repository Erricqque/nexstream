// Add these imports at the top
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

// Add these state variables
const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

// Add toggle functions
const togglePasswordVisibility = () => {
  setShowPassword(!showPassword);
};

const toggleConfirmPasswordVisibility = () => {
  setShowConfirmPassword(!showConfirmPassword);
};