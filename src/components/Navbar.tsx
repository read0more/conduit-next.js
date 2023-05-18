import React from 'react';
import Container from './Container';
import Link from 'next/link';
import styled from 'styled-components';
import { useUser } from 'src/lib/client/UserProvider';
import { useRouter } from 'next/router';

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  a {
    color: inherit;
    text-decoration: none;
  }
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: #5cb85c;
  margin: 0;
`;

const Ul = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 1em;
`;

type LiProps = {
  selected?: boolean;
};

const Li = styled.li<LiProps>`
  color: ${({ selected }) => (selected ? 'black' : 'lightgrey')};
`;

export default function Navbar() {
  const { user, isLoading } = useUser();
  const { pathname } = useRouter();
  const loggedInMenu = [
    {
      name: 'Home',
      href: '/',
    },
    {
      name: 'New Article',
      href: '/editor',
    },
    {
      name: 'Settings',
      href: '/settings',
    },
    {
      name: user?.username,
      href: `/${user?.username}`,
    },
  ];

  const loggedOutMenu = [
    {
      name: 'Home',
      href: '/',
    },
    {
      name: 'Sign in',
      href: '/login',
    },
    {
      name: 'Sign up',
      href: '/register',
    },
  ];

  const menu = user ? loggedInMenu : loggedOutMenu;

  return (
    <Container>
      <Nav>
        <Link href="/">
          <Title>conduit</Title>
        </Link>
        <Ul>
          {menu.map((item) => (
            <Li key={item.name} selected={pathname === item.href}>
              <Link href={item.href}>{item.name}</Link>
            </Li>
          ))}
        </Ul>
      </Nav>
    </Container>
  );
}
