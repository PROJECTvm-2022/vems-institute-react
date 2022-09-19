import { useLanguage } from '../store/LanguageStore';
import { useSnackbar } from 'notistack';

const useHandleError = () => {
    const { enqueueSnackbar } = useSnackbar();
    const Language = useLanguage();
    return (defaultMessage = Language.get('error.500')) => (error) => {
        enqueueSnackbar(error.message ? error.message : defaultMessage, { variant: 'error' });
    };
};

export default useHandleError;
