import React, { useState, useEffect, ReactNode } from 'react';

interface Country {
  time: ReactNode;
  name: string;
  code: string;
}

const WorldClock: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [localTimeZone, setLocalTimeZone] = useState<string>('');

  const initialCountries: any = [
    { name: 'India', code: 'IN' },
    { name: 'Germany', code: 'DE' },
  ];

  const [countries, setCountries] = useState<any>(initialCountries);

  useEffect(() => {
  
    const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setLocalTimeZone(localTimeZone);

    const intervalId = setInterval(updateTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const updateTime = () => {
 
    if (selectedCountry) {
      setSelectedCountry((prevSelectedCountry) => ({
        ...prevSelectedCountry!,
        time: new Date().toLocaleTimeString('en-US', {
          timeZone: `${selectedCountry.name}/${selectedCountry.name}`,
        }),
      }));
    }
  };

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const countryCode = event.target.value;
    const selected = countries.find((country:any) => country.code === countryCode);
    setSelectedCountry(selected || null);
  };

  return (
    <div>
      <h1>World Clock</h1>
      <ul>
        {countries.map((country:any) => (
          <li key={country.code}>
            <img
              src={`https://www.countryflags.io/${country.code}/flat/64.png`}
              alt={`${country.name} flag`}
            />
            {country.name}
            {selectedCountry?.code === country.code && (
              <span> - {selectedCountry.time}</span>
            )}
          </li>
        ))}
      </ul>
      <div>
        <p>Local Time Zone: {localTimeZone}</p>
        <label>Select a Country:</label>
        <select onChange={handleCountryChange}>
          <option value="">Select</option>
          {countries.map((country:any) => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
        {selectedCountry && (
          <p>
            {selectedCountry.name} Time: {selectedCountry.time}
          </p>
        )}
      </div>
    </div>
  );
};

export default WorldClock;
