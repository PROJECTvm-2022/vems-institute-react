import React, { createContext, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import getByDot from 'lodash/get';
import en from '../../locale/en.json';
import { useRouter } from 'next/router';
import Axios from 'axios';

const defaultLanguage = 'en';

export const LanguageContext = createContext([defaultLanguage, (language = defaultLanguage) => language, {}]);

LanguageContext.displayName = 'Language';

export const LanguageProvider = ({ local, children }) => {
    const [language, setLanguage] = useState(local);
    const [languageData, setLanguageData] = useState(en);
    const [blackList, setBlackList] = useState(['_error', '']);

    const Router = useRouter();

    useEffect(() => {
        const key = Router.pathname.slice(1, Router.pathname.length);
        if (blackList.indexOf(key) > -1) return;

        if (languageData[key] !== undefined) return;

        Axios.get(`/api/locale?key=${key}&${language}`)
            .then(({ data }) => {
                setLanguageData(({ ...langData }) => {
                    langData[key] = data;
                    return langData;
                });
            })
            .catch(() => {
                setBlackList(([...list]) => {
                    list.push(key);
                    return list;
                });
            });
    }, [Router.pathname]);

    return (
        <LanguageContext.Provider value={[language, setLanguage, languageData]}>{children}</LanguageContext.Provider>
    );
};

LanguageProvider.propTypes = {
    local: PropTypes.string.isRequired,
    children: PropTypes.any.isRequired,
    languageData: PropTypes.object,
};

class Language {
    constructor({ local, data, root }) {
        this._local = local;
        this._data = data;
        this._root = root;
    }

    get root() {
        return this._root;
    }

    get local() {
        return this._local;
    }

    get data() {
        return this._data;
    }

    get(key, data, defaultValue) {
        if (data && typeof data === 'object') {
            if (data[this.local]) {
                const result = getByDot(data[this.local], key);
                if (typeof result !== 'undefined') return result;
            } else {
                const result = getByDot(data, key);
                if (typeof result !== 'undefined') return result;
            }
        }
        const result = getByDot(this.root ? getByDot(this.data, this.root) || this.data : this.data, key);
        if (typeof result !== 'undefined') return result;
        return defaultValue ? defaultValue : key;
    }

    convert(data) {
        if (data && typeof data === 'object') {
            return data[this.local] || '';
        }
        return '';
    }
}

export const useLanguage = (root) => {
    const [local, , data] = useContext(LanguageContext);
    return new Language({ local, data, root });
};
