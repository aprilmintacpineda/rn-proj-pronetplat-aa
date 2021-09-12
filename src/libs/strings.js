import React from 'react';
import { Text } from 'react-native-paper';
import { personalPronouns } from './user';
import TextLink from 'components/TextLink';

export function capitalize (value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function camelToTitleCase (value) {
  return String(value)
    .replace(/([A-Z])/g, '_$1')
    .split('_')
    .reduce((accumulator, current) => {
      if (accumulator) accumulator += ' ';
      accumulator += capitalize(current);
      return accumulator;
    }, '');
}

export function shortenStr (str, maxLen) {
  if (str.length < maxLen) return str;
  return str.substr(0, maxLen) + '...';
}

export function renderLinks (messageBody) {
  const pattern =
    /(?:https?:\/\/)?(?:[a-zA-Z]+(?:[a-zA-Z0-9-]+)?\.)?[a-zA-Z]+(?:[a-zA-Z0-9-]+)?\.[a-zA-Z0-9.]+\S*/gim;
  const body = [];
  // setup starting index for first loop
  let startingIndex = 0;
  let match = pattern.exec(messageBody);

  // grab all links
  while (match) {
    // grab the texts before the link
    body.push(messageBody.slice(startingIndex, match.index));

    // make sure the url always has a protocol to
    let url = match[0];

    if (!/^https?:\/\//gim.test(url)) url = `https://${url}`;

    // push the link making it pressable
    body.push(
      <TextLink
        isExternal
        key={`${url}-${startingIndex}-${match.index}`}
        textMode
        to={url}
      >
        {url}
      </TextLink>
    );

    // set starting index of next loop
    startingIndex = pattern.lastIndex;
    // grab all other links
    match = pattern.exec(messageBody);
  }

  if (!body.length) return messageBody;

  // add the rest of the text
  body.push(messageBody.slice(startingIndex));

  return body;
}

export function replacePlaceholders (str, replacers, data) {
  const texts = [];

  let currentText = '';
  const words = str.split(' ');
  const wordsLastIndex = words.length - 1;

  words.forEach((word, index) => {
    const isLastWord = wordsLastIndex === index;
    const hasDotAtEnd = isLastWord && word.endsWith('.');
    const replacer =
      replacers[hasDotAtEnd ? word.replace('.', '') : word];

    if (replacer) {
      if (currentText) {
        texts.push(
          <Text key={`${index}-${word}-${currentText}`}>
            {currentText}{' '}
          </Text>
        );

        currentText = '';
      }

      const value = replacer(data);

      texts.push(
        <Text
          key={`${index}-${word}-${value}`}
          style={
            personalPronouns.includes(value) || value === 'your'
              ? null
              : { fontWeight: 'bold' }
          }
        >
          {value}
        </Text>
      );

      if (hasDotAtEnd) currentText += '.';
    } else {
      currentText += ` ${word}`;
    }

    if (isLastWord) {
      texts.push(
        <Text key={`${index}-${currentText}-${word}`}>
          {currentText}
        </Text>
      );
    }
  });

  return texts;
}
