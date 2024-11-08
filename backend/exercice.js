var buildAvatarUrl = function (context, prenom, nom) {
  if (
    typeof context === 'string' &&
    (context === null || context === void 0
      ? void 0
      : context.includes('default'))
  )
    return '';
  return 'https://ui-avatars.com/api/?name='
    .concat(prenom ? prenom[0].toUpperCase() : '', '+')
    .concat(nom ? nom[0].toUpperCase() : '');
};
console.log(buildAvatarUrl('aa', 'John', 'Doe'));
