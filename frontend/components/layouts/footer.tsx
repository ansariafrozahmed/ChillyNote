import Loading from './loading';

const Footer = () => {
    return <div className="mt-auto w-full  bg-white px-3 py-3 dark:text-white-dark ltr:sm:text-right rtl:sm:text-right">© {new Date().getFullYear()}. Chilly Note All rights reserved.</div>;
};

export default Footer;
